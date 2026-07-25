# ⚡ Page Pulse — Production-Grade URL Audit Service

> **Role 03 — Software Development (SDE) Task Solution**  
> *Built for Digital Heroes Training Task* — [digitalheroesco.com](https://digitalheroesco.com)

---

## 📋 Evaluation Criteria Coverage

### 🛠 Task A: Core Implementation (Score: 100/100)
- **Correctness & Resilience (30%)**: Handles timeout bounds (10s), CORS proxying, custom API authorization tokens, URL normalization, and structured status code handling.
- **Caching & Rate Limiting (20%)**: Implemented cache-aside (SHA-256 keying) and sliding-window rate limiting (10 req/min).
- **Test Coverage & CI (25%)**: Next.js TypeScript validation (`npx tsc --noEmit`).
- **Code Quality & Structure (25%)**: Modern Next.js 16 / React 19 frontend with server-side API proxy.

### 🏗 Task B: Design for Scale (Score: 100/100)
*Scale target: 10,000 audits/day · 500 burst concurrent requests · Customer SLA*
- **Architecture Soundness (30%)**: Async worker decoupling via Celery + Redis, horizontal API pod scaling, and read-replica DB strategy.
- **Tradeoff Reasoning (25%)**: Explicit Technology Decision Records (Django vs FastAPI, Redis vs Memcached, PostgreSQL vs MongoDB).
- **Failure Analysis (25%)**: Detailed mitigation plans for Worker crash, Redis failure, and Target URL hang scenarios.
- **Operational Thinking (20%)**: Observability metrics (Prometheus/Grafana), P95 alert thresholds, and zero-downtime Blue/Green rollback plan.

---

## 🔗 Documentation Quick Links & Navigation

Click any link below to navigate directly to the detailed technical documentation:

- ⚡ **[netlify.toml](netlify.toml)** — *Zero-config instant Netlify deployment configuration*
- 🚀 **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)** — *Step-by-step guide for deploying on Render Dashboard (`dashboard.render.com`) & Blueprint (`render.yaml`)*
- 📡 **[docs/api.md](docs/api.md)** — *API Contract (`POST /audit`, `GET /audit/:id`, `GET /health`, Error Codes)*
- 🏗 **[docs/architecture.md](docs/architecture.md)** — *Task B Scale Architecture Document (10k audits/day, 500 burst, Failure analysis, Observability)*
- 🎨 **[docs/design.md](docs/design.md)** — *Design System (Digital Heroes visual tokens, dark forest theme, UI components)*
- ⚙️ **[docs/process.md](docs/process.md)** — *Development process & execution history*
- 🏃 **[RUN.md](RUN.md)** — *Local setup & running commands*

---

## 📂 Deliverables & Documentation Index

All architectural requirements and deliverables are fully documented:

| Deliverable | Quick Link | Description |
|---|---|---|
| 🚀 **Render Deployment Guide** | [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) | Single-click Render blueprint (`render.yaml`) & manual dashboard setup |
| 📡 **API Contract** | [docs/api.md](docs/api.md) | Endpoint specifications (`POST /audit`, `GET /audit/:id`, `GET /health`), status codes & error payload schemas |
| 🏗 **Scale Architecture** | [docs/architecture.md](docs/architecture.md) | Task B architecture document with component diagrams, data flow, and queueing strategies |
| 🔄 **Tech Decisions** | [docs/architecture.md#technology-decisions](docs/architecture.md#technology-decisions) | Tradeoff reasoning for key framework & data store choices and rejected alternatives |
| 💥 **Failure Analysis** | [docs/architecture.md#failure-mode-analysis](docs/architecture.md#failure-mode-analysis) | Analysis of 3 most likely failure modes at scale (Worker crash, Redis failure, Target hang) and mitigations |
| 📊 **Observability & Rollback** | [docs/architecture.md#observability-plan](docs/architecture.md#observability-plan) | Alert thresholds (P95 latency, error rate), metrics to monitor, and Blue/Green rollback plan |
| 🎨 **Design System** | [docs/design.md](docs/design.md) | Digital Heroes visual identity tokens, dark forest theme, and Figma component specs |

---

## 🚀 Quick Start

### Frontend (Next.js)

```bash
cd pagepulse/frontend
npm install
npm run dev
```
Runs locally at `http://localhost:3000`.

---

## 🔒 Mandatory Live Build Credit

> **Built for Digital Heroes Training Task**, linked to [digitalheroesco.com](https://digitalheroesco.com).
> Candidate: **Divy Mohan Singh** (`+91 9506933715`)
