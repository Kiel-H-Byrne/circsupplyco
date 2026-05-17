# GCP Deployment Reference - Circulate Supply Co.

This document contains key information for administering and deploying the Medusa backend and Next.js storefront on Google Cloud Platform (GCP).

## Project Overview
- **Project ID**: `circ-supply-co-backend`
- **Primary Region**: `us-central1`
- **Owner**: `kiel.byrne@gmail.com`

## Infrastructure Details

### Network (VPC)
- **VPC Name**: `medusa-vpc`
- **VPC Access Connector**: `medusa-vpc-connector`
  - Purpose: Allows Cloud Run to connect to private SQL and Redis instances.
  - Usage: `--vpc-connector medusa-vpc-connector`

### Database (Cloud SQL)
- **Instance ID**: `medusa-db`
- **Private IP**: `10.112.1.3`
- **Engine**: PostgreSQL 15
- **Tier**: `db-f1-micro` (Development/Small)
- **Database URL (Internal)**: `postgres://postgres:<PASSWORD>@10.112.1.3:5432/medusa`

### Cache (Memorystore for Redis)
- **Instance ID**: `medusa-cache`
- **Private IP**: `10.112.0.3`
- **Port**: `6379`
- **Redis URL (Internal)**: `redis://10.112.0.3:6379`

### Storage (Cloud Storage)
- **Bucket Name**: `circ-supply-co-assets`
- **Purpose**: Product images and other media.
- **Endpoint**: `https://storage.googleapis.com`

### Artifact Registry
- **Repository**: `medusa-repo`
- **Location**: `us-central1`
- **Image Path**: `us-central1-docker.pkg.dev/circ-supply-co-backend/medusa-repo/medusa-backend`

---

## Useful Commands

### 1. View Cloud Run Services
```bash
gcloud run services list --project=circ-supply-co-backend
```

### 2. Tail Backend Logs
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=medusa-backend" --limit=50
```

### 3. Connect to SQL (using Auth Proxy)
```bash
./cloud-sql-proxy circ-supply-co-backend:us-central1:medusa-db
```

### 4. Deploy Backend to Cloud Run (Manual)
```bash
gcloud run deploy medusa-backend \
  --image us-central1-docker.pkg.dev/circ-supply-co-backend/medusa-repo/medusa-backend:latest \
  --region us-central1 \
  --vpc-connector medusa-vpc-connector \
  --service-account 807814514312-compute@developer.gserviceaccount.com \
  --env-vars-file env.production.yaml \
  --port 9000 \
  --timeout 600 \
  --cpu 2 \
  --memory 2Gi \
  --allow-unauthenticated
```

## Required Environment Variables (Cloud Run)

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | `postgres://postgres:<PASSWORD>@10.112.1.3:5432/medusa` |
| `REDIS_URL` | `redis://10.112.0.3:6379` |
| `STORE_CORS` | `https://circsupplyco.com` (Frontend URL) |
| `ADMIN_CORS` | `https://medusa-backend-2qna76uv3a-uc.a.run.app` (Backend URL) |
| `AUTH_CORS` | Same as `ADMIN_CORS` and `STORE_CORS` |
| `JWT_SECRET` | A secure random string |
| `COOKIE_SECRET` | A secure random string |
| `S3_FILE_URL` | `https://storage.googleapis.com/circ-supply-co-assets` |
| `S3_BUCKET` | `circ-supply-co-assets` |
| `S3_ACCESS_KEY_ID` | HMAC key for GCS |
| `S3_SECRET_ACCESS_KEY` | HMAC secret for GCS |

## Troubleshooting & Common Fixes

### 1. TypeScript Errors in Migration Scripts
If the build fails due to `TS18047: 'sc' is possibly 'null'`, ensure you are using optional chaining in `diagnose-products.ts` and `fix-api-key-links.ts`.
Example: `p.sales_channels?.map(sc => sc?.name)`

### 2. Slow Docker Builds (npm ci)
In a monorepo, `npm ci` can be extremely slow in Docker. The Dockerfile has been optimized to use `npm install --no-audit --no-fund` and uses a high-CPU build machine (`E2_HIGHCPU_8`).

### 3. medusa-config.js Missing
The production build generates `medusa-config.js` inside `.medusa/server/`.

### 4. Admin Dashboard (index.html) Not Found
If the server fails to start with "Could not find index.html", ensure the Dockerfile is correctly copying the entire build output from the builder stage. Medusa v2 requires the admin build to be present to start in production mode.

### 5. Port Configuration
Cloud Run sets the `PORT` environment variable. Medusa v2 respects this automatically, but you must ensure the Cloud Run service is configured to listen on the correct port (default 9000 for Medusa).

## Administration
- **GCP Console**: [https://console.cloud.google.com/home/dashboard?project=circ-supply-co-backend](https://console.cloud.google.com/home/dashboard?project=circ-supply-co-backend)
- **Medusa Admin**: Once deployed, the admin will be available at `<BACKEND_URL>/app`.
//medusa-backend-2qna76uv3a-uc.a.run.app/app)
