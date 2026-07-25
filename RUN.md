# 🚀 Run Guide — Page Pulse

This guide covers setup instructions for both **First-Time Setup** (scaffolding dependencies, virtual environments, build configuration) and **Regular Development / Production Run**.

---

## 📋 Prerequisites

Ensure the following tools are installed on your machine:
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- **Python**: v3.10, v3.11, or v3.12 (`python --version`)
- **Git**: (`git --version`)

---

## 🛠️ Section 1: First-Time Setup

Run these commands ONCE when setting up the repository on a fresh machine.

### 1.1 Backend Setup (Python + Virtual Environment)

```bash
# 1. Navigate to backend directory
cd page-pulse/backend

# 2. Create Python virtual environment
python -m venv venv

# 3. Activate virtual environment
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On Windows (CMD):
.\venv\Scripts\activate.bat
# On macOS / Linux:
source venv/bin/activate

# 4. Upgrade pip and install dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 1.2 Frontend Setup (Next.js + Node Modules)

```bash
# 1. Navigate to frontend directory
cd page-pulse/frontend

# 2. Install Node.js dependencies
npm install
```

---

## ⚡ Section 2: Regular Run (Daily Development)

Run these commands whenever you return to work on the project.

### 2.1 Starting the Frontend (Next.js Dev Server)

```bash
cd page-pulse/frontend
npm run dev
```
> Open your browser at [http://localhost:3000](http://localhost:3000)

### 2.2 Running Backend Unit Tests

```bash
cd page-pulse/backend

# Activate venv first if not active
.\venv\Scripts\activate

# Run test suite
python test_auditor.py
```

### 2.3 Building Production Bundles

#### Frontend Build:
```bash
cd page-pulse/frontend
npm run build
```

---

## 🧪 Section 3: Verification & Sanity Test Checklist

To verify everything is working properly:

1. **Frontend Check**: Run `npm run build` inside `page-pulse/frontend` — it should compile with zero TypeScript errors.
2. **Backend Check**: Run `python test_auditor.py` inside `page-pulse/backend` — all tests should pass (`OK`).
3. **UI Check**: Visit `http://localhost:3000`, enter a URL (e.g. `https://example.com`), and verify that scores, load times, and SEO breakdown render correctly.
