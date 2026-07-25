# 🚀 Run Guide — Page Pulse

This guide covers setup instructions for both **First-Time Setup** (scaffolding dependencies, build configuration) and **Regular Development / Production Run**.

---

## 📋 Prerequisites

Ensure the following tools are installed on your machine:
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- **Git**: (`git --version`)

---

## 🛠️ Section 1: First-Time Setup

Run these commands ONCE when setting up the repository on a fresh machine.

### 1.1 Frontend Setup (Next.js + Node Modules)

```bash
# 1. Navigate to frontend directory
cd pagepulse/frontend

# 2. Install Node.js dependencies
npm install
```

---

## ⚡ Section 2: Regular Run (Daily Development)

Run these commands whenever you return to work on the project.

### 2.1 Starting the Frontend (Next.js Dev Server)

```bash
cd pagepulse/frontend
npm run dev
```
> Open your browser at [http://localhost:3000](http://localhost:3000)

### 2.2 Building Production Bundles

#### Frontend Build:
```bash
cd pagepulse/frontend
npm run build
```

---

## 🧪 Section 3: Verification & Sanity Test Checklist

To verify everything is working properly:

1. **Frontend Check**: Run `npm run build` inside `pagepulse/frontend` — it should compile with zero TypeScript errors.
2. **UI Check**: Visit `http://localhost:3000`, enter a URL (e.g. `https://example.com`), and verify that scores, load times, and SEO breakdown render correctly.
