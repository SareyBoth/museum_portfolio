# Museum Portfolio & CMS

Architectural 3D WebGL art museum and editorial portfolio wing built with Next.js 16, Three.js, PostgreSQL (Drizzle ORM), Redis, and Cloudflare R2 object storage.

---

## Architecture Overview

1. Frontend & 3D Spatial Canvas: Three.js WebGL museum atrium with raycasting inspection, dynamic camera controllers, and scroll-to-enter portal transition into an editorial exhibition wing.
2. Relational Database: PostgreSQL managed via Drizzle ORM storing projects, media asset metadata, contact inquiries, experience ledgers, skills, and site settings.
3. Cache & Rate Limiting: Redis caching layer for read-through portfolio queries and sliding-window IP rate limiting on public inquiry submissions.
4. Binary Asset Storage: Cloudflare R2 bucket with presigned PUT upload URLs for direct browser-to-bucket media uploads (images, 4K video reels, master PDFs).
5. Administration Suite: Authenticated `/dashboard` CMS for managing site content, reviewing client inquiries, and uploading media.

---

## Prerequisites

Ensure the following tools are installed on your host machine:

- Node.js: Active LTS (version 20 or version 22)
- Package Manager: npm (version 10 or later)
- Docker & Docker Compose: For running local PostgreSQL and Redis instances
- Cloudflare Account: For provisioning Cloudflare R2 object storage

---

## Step 1: Clone Repository & Install Dependencies

```bash
git clone https://github.com/SareyBoth/museum_portfolio.git
cd museum_portfolio
npm install
```

---

## Step 2: Configure Environment Variables

Create your local `.env` configuration file from the template:

```bash
cp .env.example .env
```

Edit `.env` and verify the required configuration keys:

```env
# PostgreSQL Database Connection
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/art_gallery

# Redis Cache & Rate Limiting
REDIS_URL=redis://localhost:6379

# Cloudflare R2 S3-Compatible Object Storage
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=art-gallery
R2_PUBLIC_URL=https://pub-your-bucket-id.r2.dev

# Initial Administrator Account (used during seed)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me-immediately
ADMIN_NAME=Admin

# Application Host URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Step 3: Run Local Database & Redis (Docker)

Start the PostgreSQL 16 and Redis 7 services using the provided `docker-compose.yml`:

```bash
docker compose up -d
```

Verify that both containers are running and healthy:

```bash
docker compose ps
```

To stop the containers when finished developing:

```bash
docker compose down
```

---

## Step 4: Initialize & Seed PostgreSQL Database

Push the relational schema declared in `db/schema.ts` to your PostgreSQL database:

```bash
npm run db:push
```

Seed the database with initial portfolio works, museum gallery link IDs, experience records, skills, and the primary administrator account:

```bash
npm run db:seed
```

To inspect and browse your database visually in a local GUI:

```bash
npm run db:studio
```

---

## Step 5: Configure Cloudflare R2 Object Storage

The application streams media files directly from the browser to Cloudflare R2 via presigned URLs.

### 5.1 Create R2 Bucket

1. Log in to the Cloudflare Dashboard and navigate to R2 Object Storage.
2. Click Create bucket.
3. Name your bucket (e.g., `art-gallery`) and choose your preferred location hint.
4. Click Create Bucket.

### 5.2 Configure Public Access or Custom Domain

1. In your bucket settings, go to the Settings tab.
2. Under Public Access, enable R2.dev subdomain or connect your own Custom Domain (e.g., `media.yourdomain.com`).
3. Copy the public base URL into your `.env` file under `R2_PUBLIC_URL` without a trailing slash (e.g., `https://pub-xxx.r2.dev` or `https://media.yourdomain.com`).

### 5.3 Generate S3 API Credentials

1. Return to the main R2 page in Cloudflare and select Manage R2 API Tokens.
2. Click Create API token.
3. Grant Object Read & Write permissions scoped to your bucket.
4. Copy the generated Access Key ID and Secret Access Key.
5. In your `.env` file, populate:
   - `R2_ACCOUNT_ID`: Found on your Cloudflare R2 dashboard overview right sidebar.
   - `R2_ACCESS_KEY_ID`: Your token Access Key ID.
   - `R2_SECRET_ACCESS_KEY`: Your token Secret Access Key.
   - `R2_BUCKET_NAME`: The exact name of your bucket.

### 5.4 Configure Bucket CORS Policy

Direct browser uploads require Cross-Origin Resource Sharing (CORS) enabled on the bucket.

In your Cloudflare bucket Settings tab, scroll to CORS Policy, click Add CORS policy, and paste the following configuration:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://yourdomain.com"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "HEAD"
    ],
    "AllowedHeaders": [
      "Content-Type",
      "Content-Length"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

---

## Step 6: Start Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

- Public Experience: `http://localhost:3000/`
- Admin Authentication: `http://localhost:3000/login`
- CMS Management Dashboard: `http://localhost:3000/dashboard`

Log in using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` defined in your `.env` file.

---

## Step 7: Production Build & Deployment

Verify TypeScript types and compile a production build:

```bash
npm run build
```

Start the production Next.js server:

```bash
npm run start
```

### Deploying to Render, Railway, or VPS

When deploying to a cloud platform:

1. Provision a managed PostgreSQL instance and supply the external connection string in `DATABASE_URL`.
2. Provision a managed Redis instance (e.g., Upstash or cloud Redis) and supply `REDIS_URL`.
3. Provide your Cloudflare R2 credentials in the production environment settings.
4. Execute `npm run db:push` and `npm run db:seed` during release phase or initial deployment.
5. Ensure your production domain is added to your Cloudflare R2 CORS AllowedOrigins list.
