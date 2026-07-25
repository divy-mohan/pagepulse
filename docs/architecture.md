# 🏗 Architecture — Page Pulse

> Scale target: 10,000 audits/day · Bursts of 500 concurrent requests · Customer-facing SLA on response time

---

## System Overview

```
┌────────────────────────────────────────────────────────┐
│                        CLIENTS                         │
│           (Browser · Next.js Frontend · API)           │
└────────────────────┬───────────────────────────────────┘
                     │ HTTPS
                     ▼
┌────────────────────────────────────────────────────────┐
│                   NGINX / CDN Edge                     │
│         (TLS termination · Static assets · DoS)        │
└────────────────────┬───────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────┐
│              Django REST API (Gunicorn)                 │
│   ┌─────────────┐  ┌───────────────┐  ┌────────────┐  │
│   │  Auth/Rate  │  │  Audit Views  │  │  Health    │  │
│   │  Throttle   │  │  POST /audit  │  │  GET /     │  │
│   └─────────────┘  └───────┬───────┘  └────────────┘  │
└───────────────────────────┬────────────────────────────┘
                            │
               ┌────────────┴────────────┐
               │                         │
               ▼                         ▼
  ┌────────────────────┐     ┌───────────────────────┐
  │   Redis Cache      │     │   Job Queue (BullMQ / │
  │  (Cache-Aside)     │     │   Celery + Redis)     │
  │  TTL: configurable │     │  For burst handling   │
  └────────────────────┘     └──────────┬────────────┘
                                        │
                                        ▼
                             ┌──────────────────────┐
                             │   Audit Workers (N)  │
                             │  (requests + BS4)    │
                             └──────────┬───────────┘
                                        │
                                        ▼
                             ┌──────────────────────┐
                             │   PostgreSQL DB       │
                             │  (Persistent store)  │
                             └──────────────────────┘
```

---

## Component Breakdown

| Component | Technology | Responsibility |
|---|---|---|
| **API Gateway** | Nginx / Railway ingress | TLS, routing, basic DoS protection |
| **REST API** | Django + DRF + Gunicorn | Request handling, validation, response |
| **Cache** | Redis (Upstash) | Store audit results, serve repeat requests instantly |
| **Job Queue** | Celery + Redis | Decouple heavy audit work from request cycle |
| **Audit Workers** | Python workers (N replicas) | Fetch URL, parse HTML, compute score |
| **Database** | PostgreSQL | Persistent audit history, analytics |
| **Observability** | Pino/structlog → Logtail | Structured logs, metrics, alerting |

---

## Data Flow

### Happy Path (Cache Miss)

```
1. Client → POST /audit { url }
2. API validates input → checks Redis cache
3. Cache MISS → API enqueues job to Redis queue
4. Returns 202 { request_id, poll_url }   (or waits synchronously for small loads)
5. Worker picks up job → fetches URL (timeout 10s) → parses HTML
6. Worker computes scores → stores in Redis (TTL) + PostgreSQL
7. Client polls GET /audit/{id} → gets result
```

### Happy Path (Cache Hit)

```
1. Client → POST /audit { url }
2. API validates input → checks Redis cache
3. Cache HIT → returns result immediately with cached: true
4. Response time: < 50ms
```

### Burst Handling (500 concurrent)

```
1. 500 simultaneous POST /audit requests arrive
2. API layer rate-limits per IP (10/min), queues the rest
3. Queue absorbs burst → workers process at controlled rate (e.g., 50 concurrent)
4. Each client gets 202 + polls for result
5. No server crash, no dropped requests
```

---

## Technology Decisions

### Why Django + DRF?

| Factor | Rationale |
|---|---|
| Rapid development | DRF serializers handle validation + serialization out of the box |
| Production maturity | Battle-tested in production at Instagram-scale |
| ORM | Clean PostgreSQL integration, migrations, admin interface |
| Throttling | Built-in throttle classes with Redis backend |

**Alternative considered:** FastAPI (Node.js/Express)
**Why rejected:** Django's batteries-included approach reduces boilerplate significantly for this scope. FastAPI would require wiring validation, ORM, and admin manually.

---

### Why Redis for Cache?

| Factor | Rationale |
|---|---|
| Sub-millisecond reads | P99 < 1ms for cache hits |
| Native TTL | Automatic expiry without cron jobs |
| Shared across workers | All API replicas see the same cache |
| BullMQ/Celery compatible | Same Redis instance powers both cache + queue |

**Alternative considered:** Memcached, in-memory (Django's default)
**Why rejected:** Memcached lacks native data structures for queue. In-memory doesn't survive process restarts and isn't shared across replicas.

---

### Why PostgreSQL for Persistence?

| Factor | Rationale |
|---|---|
| JSON column support | `audit_data JSONField` stores flexible audit payloads |
| ACID transactions | Reliable audit history |
| Railway managed | Free tier with automatic backups |

**Alternative considered:** MongoDB
**Why rejected:** Unnecessary operational complexity. PostgreSQL's JSONB handles semi-structured data with indexing support.

---

## Failure Mode Analysis

### 1. Worker Crash Mid-Audit

| | Detail |
|---|---|
| **Probability** | Medium |
| **Impact** | Single audit lost; client sees timeout |
| **Mitigation** | Celery task retries (max 3, exponential backoff). Dead Letter Queue for permanently failed jobs. Client can re-submit. |

---

### 2. Redis Goes Down

| | Detail |
|---|---|
| **Probability** | Low (managed Upstash) |
| **Impact** | All requests become cache misses. Rate limiting disabled temporarily. |
| **Mitigation** | Cache-aside pattern — fall back to direct DB lookup. Django configured with `CACHE_BACKEND = "dummy"` fallback. Redis Sentinel for HA in production. Alert fires immediately. |

---

### 3. Target URL Hangs / Never Responds

| | Detail |
|---|---|
| **Probability** | High (user-provided URLs are untrusted) |
| **Impact** | Worker thread blocked; cascading timeouts |
| **Mitigation** | Hard 10s timeout via `requests.get(timeout=10)`. Per-domain circuit breaker: after 3 consecutive timeouts, domain is blocked for 60s. |

---

## Observability Plan

### Metrics to Monitor

| Metric | Alert Threshold | Action |
|---|---|---|
| Queue depth | > 500 jobs | Scale up workers |
| P95 response latency | > 10s | PagerDuty alert |
| Error rate (5xx) | > 5% over 5 min | Auto-rollback |
| Cache hit rate | < 30% | Investigate TTL config |
| Worker failure rate | > 10% | Scale up + alert |

### Logging

Every log line contains:
- `request_id` — full request traceability
- `event` — structured event name
- `duration_ms` — timing
- `level` — INFO / WARNING / ERROR
- `timestamp` — ISO 8601

### Rollback Strategy

- Deployments use **blue/green** on Railway: new version receives 0% traffic until health check passes.
- If P95 latency or error rate spike post-deploy: one-click traffic switch back to previous version.
- Database migrations are backward-compatible (no destructive `ALTER TABLE` without a transition period).
- Redis cache survives rollbacks (no cache invalidation needed).

---

## SLA Targets

| Metric | Target |
|---|---|
| Uptime | 99.9% |
| Cache hit response time | < 100ms |
| Fresh audit response time | < 15s |
| Burst capacity | 500 concurrent |
| Daily throughput | 10,000+ audits |
