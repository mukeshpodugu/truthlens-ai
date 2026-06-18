# Cloud Production Deployment Guide - TruthLens AI

This guide explains how to deploy **TruthLens AI** to production cloud platforms. We will use:
1. **Render.com** (or Railway) to host the FastAPI backend, PostgreSQL, and Redis cache.
2. **Vercel** to host the Next.js frontend.

---

## 1. Backend & Database Deployment (Render.com)

Render is ideal for hosting web services, managed databases, and Redis clusters.

### Step 1: Deploy PostgreSQL Database
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New** -> **PostgreSQL**.
3. Configure the database:
   - **Name**: `truthlens-db`
   - **Database Name**: `truthlens_db`
   - **User**: `truthlens_admin`
4. Click **Create Database**.
5. Save the **Internal Database URL** (for backend communication) and **External Database URL** (for migrations).

### Step 2: Deploy Redis Cache
1. Click **New** -> **Redis**.
2. Configure:
   - **Name**: `truthlens-redis`
3. Click **Create Redis**.
4. Save the **Internal Redis Connection String**.

### Step 3: Deploy FastAPI Backend Web Service
1. Push your code to a GitHub repository.
2. Click **New** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
   - **Name**: `truthlens-backend`
   - **Environment**: `Docker` (Render will automatically detect the `./backend/Dockerfile`)
   - **Docker Build Context**: `./backend`
   - **Docker File Path**: `./Dockerfile`
5. Expand **Advanced** and add the following **Environment Variables**:
   - `DATABASE_URL`: *(Your Internal PostgreSQL Database URL from Step 1)*
   - `REDIS_URL`: *(Your Internal Redis URL from Step 2)*
   - `JWT_SECRET`: *(A secure random string, e.g., `d7a5b3...`)*
   - `ENVIRONMENT`: `production`
6. Click **Create Web Service**.
7. Once deployed, note down the provided Render service URL (e.g., `https://truthlens-backend.onrender.com`).

---

## 2. Frontend Deployment (Vercel)

Vercel is the native platform for Next.js, offering automatic serverless routing and globally distributed caching.

### Step 1: Configure Environment Variables
1. Log in to the [Vercel Dashboard](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Configure Project settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Under **Environment Variables**, add:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://truthlens-backend.onrender.com/api/v1` *(Your Render backend URL)*
6. Click **Deploy**.
7. Vercel will build and launch your client interface (e.g., `https://truthlens-ai.vercel.app`).

---

## 3. VPS Deployment via Docker Compose (AWS EC2 / DigitalOcean)

If you prefer deploying on your own Virtual Private Server (VPS), you can run the entire stack inside Docker Compose with an Nginx reverse proxy.

### Step 1: Prepare VPS
1. Provision a Linux server (Ubuntu 22.04 LTS is recommended).
2. SSH into your instance.
3. Install Docker and Docker Compose:
   ```bash
   sudo apt-get update
   sudo apt-get install -y docker.io docker-compose
   ```

### Step 2: Set Environment Config
1. Clone your project onto the server:
   ```bash
   git clone https://github.com/yourusername/truthlens-ai.git
   cd truthlens-ai
   ```
2. Modify variables inside the backend `.env` file to point to production secrets.

### Step 3: Run the Stack
Run Docker Compose in detached mode:
```bash
docker-compose -f docker-compose.yml up --build -d
```
All containers (Next.js at port 3000, FastAPI at port 8000, PostgreSQL at 5432, Redis at 6379) will start automatically.

### Step 4: Configure Nginx (Reverse Proxy & SSL)
1. Install Nginx:
   ```bash
   sudo apt-get install -y nginx
   ```
2. Create Nginx site config `/etc/nginx/sites-available/truthlens`:
   ```nginx
   server {
       listen 80;
       server_name truthlens.yourdomain.com;

       location /api/v1/ {
           proxy_pass http://localhost:8000/api/v1/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location / {
           proxy_pass http://localhost:3000/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```
3. Enable configuration and reload Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/truthlens /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```
4. Obtain free SSL certificates using Certbot:
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d truthlens.yourdomain.com
   ```
