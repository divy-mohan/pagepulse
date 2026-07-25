# 📡 API Contract — Page Pulse

> Base URL: `https://page-pulse.up.railway.app/api/v1`
> All requests and responses are JSON. All timestamps are ISO 8601 UTC.

---

## Authentication

Currently open API. Rate limiting is enforced per client IP.
Future versions will support `Authorization: Bearer <token>`.

---

## Endpoints

---

### `POST /audit`

Submit a URL for auditing.

#### Request

```http
POST /api/v1/audit
Content-Type: application/json
```

```json
{
  "url": "https://api.example.com/v1/data",
  "headers": {
    "Authorization": "Bearer <optional_token>",
    "X-API-Key": "<optional_key>"
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `url` | string | ✅ Yes | Fully qualified URL to audit (`https://` required) |
| `headers` | object | ❌ No | Optional custom HTTP headers (e.g. API keys, Authorization headers) for auditing protected endpoints |

#### Response — `200 OK` (Cache Miss — Fresh Audit)

```json
{
  "request_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "url": "https://example.com",
  "audited_at": "2026-07-25T01:30:00Z",
  "cached": false,
  "cache_expires_at": "2026-07-25T01:35:00Z",
  "audit": {
    "status_code": 200,
    "load_time_ms": 342,
    "page_size_bytes": 14823,
    "title": "Example Domain",
    "meta_description": "This domain is for use in illustrative examples.",
    "has_viewport_meta": true,
    "has_robots_txt": true,
    "has_sitemap": false,
    "canonical_url": "https://example.com/",
    "open_graph": {
      "title": null,
      "description": null,
      "image": null
    },
    "headings": {
      "h1_count": 1,
      "h2_count": 0,
      "h1_text": ["Example Domain"]
    },
    "images": {
      "total": 2,
      "missing_alt": 1
    },
    "https": true,
    "redirect_chain": [],
    "score": {
      "overall": 74,
      "seo": 68,
      "performance": 81,
      "accessibility": 72
    }
  }
}
```

#### Response — `200 OK` (Cache Hit)

Same as above but:
```json
{
  "cached": true,
  "cache_expires_at": "2026-07-25T01:35:00Z",
  ...
}
```

---

### `GET /audit/{request_id}`

Retrieve a previously completed audit by its ID.

#### Request

```http
GET /api/v1/audit/f47ac10b-58cc-4372-a567-0e02b2c3d479
```

#### Response — `200 OK`

Same structure as `POST /audit` response.

#### Response — `404 Not Found`

```json
{
  "request_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "error": "AUDIT_NOT_FOUND",
  "message": "No audit found with this request ID.",
  "timestamp": "2026-07-25T01:30:00Z"
}
```

---

### `GET /health`

Service health check.

#### Request

```http
GET /api/v1/health
```

#### Response — `200 OK`

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2026-07-25T01:30:00Z",
  "services": {
    "database": "ok",
    "cache": "ok"
  }
}
```

---

## Error Responses

All errors follow this structure:

```json
{
  "request_id": "f47ac10b-...",
  "error": "ERROR_CODE",
  "message": "Human-readable description.",
  "timestamp": "2026-07-25T01:30:00Z"
}
```

| HTTP Status | Error Code          | Cause                                         |
|-------------|---------------------|-----------------------------------------------|
| `400`       | `INVALID_URL`       | URL is missing, malformed, or not `https://`  |
| `400`       | `URL_UNREACHABLE`   | Target URL timed out or returned no response  |
| `422`       | `VALIDATION_ERROR`  | Request body is malformed or missing fields   |
| `429`       | `RATE_LIMIT_EXCEEDED` | Too many requests from this client IP       |
| `500`       | `INTERNAL_ERROR`    | Unexpected server error                       |
| `503`       | `SERVICE_UNAVAILABLE` | Downstream dependency (cache/db) is down   |

---

## Rate Limiting

| Limit        | Window   | Header Returned              |
|--------------|----------|------------------------------|
| 10 requests  | 1 minute | `X-RateLimit-Remaining: N`   |
| —            | —        | `Retry-After: <seconds>`     |

Rate limit resets every 60 seconds per client IP.

---

## Caching

- Cache TTL is configurable via `CACHE_TTL_SECONDS` environment variable (default: `300` — 5 minutes).
- Cache key: SHA-256 hash of the normalized URL.
- `cached: true` in the response indicates the result was served from cache.
- `cache_expires_at` tells the client when the cache will expire.

---

## Request IDs

Every request (successful or not) receives a unique `request_id` (UUID v4).
Include this ID in any bug reports or support requests.
It appears in all server logs for full traceability.

---

## Scoring Methodology

| Dimension      | Factors Considered                                          |
|----------------|-------------------------------------------------------------|
| SEO            | Title, meta description, H1, canonical, robots.txt, sitemap |
| Performance    | Load time, page size, redirect chain length                 |
| Accessibility  | Alt text on images, viewport meta, heading hierarchy        |
| Overall        | Weighted average of above three                             |

Scores are 0–100. Higher is better.
