# 🚀 Render Deployment Guide — Page Pulse

This guide provides step-by-step instructions to deploy **Page Pulse** on [Render Dashboard](https://dashboard.render.com/).

---

## ⚡ Option 1: Automatic Deployment using Render Blueprint (`render.yaml`) — Recommended

The repository includes a pre-configured `render.yaml` infrastructure file.

### Steps:
1. Push your latest code to your GitHub repository:
   ```bash
   git push origin main
   ```
2. Log into [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** in the top right corner and select **Blueprints**.
4. Connect your GitHub repository (`pagepulse`).
5. Render will automatically detect `render.yaml` and provision:
   - **`page-pulse-web`**: Next.js 16 Web Service (Node.js runtime)
    - **`page-pulse-web`**: Next.js 16 Web Service (Node.js runtime)
6. Click **Apply**. Render will build and deploy the service automatically!

---

## 🛠 Option 2: Manual Web Service Deployment on Render

If you prefer to configure services manually on the dashboard:

### 1. Deploy Frontend Web App (Next.js)

1. On [Render Dashboard](https://dashboard.render.com/), click **New +** → **Web Service**.
2. Select **Build and deploy from a Git repository** and connect `pagepulse`.
3. Configure the following fields:

| Field | Value |
|---|---|
| **Name** | `page-pulse-web` |
| **Region** | Oregon (US West) or closest region |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start` |
| **Instance Type** | Free / Starter |

4. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `3000`
5. Click **Create Web Service**.

---

## 🔒 Verification Checklist

After deployment finishes:
1. Open your live `.onrender.com` URL (e.g., `https://page-pulse-web.onrender.com`).
2. Test auditing any URL (e.g. `https://digitalheroesco.com` or `https://allbirds.com`).
3. Verify that the footer & top navigation display the mandatory credit:  
   **"Built for Digital Heroes Training Task"** linked to `digitalheroesco.com`.
