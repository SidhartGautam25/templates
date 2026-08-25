# Developer Guide: Chanakya Resort / Godrej Pune Project

Welcome to the developers' setup and maintenance guide. This document outlines the stack, database integration, asset management pipeline, and step-by-step instructions to get the application up and running successfully.

---

## 1. Tech Stack Overview

The project is built on the following modern technologies:
- **Framework**: [Next.js 16.2.7](https://nextjs.org/) (App Router, TypeScript, React 19.2.4).
- **ORM & Database**: [Prisma 7.8.0](https://www.prisma.io/) with custom MariaDB database adapter (`@prisma/adapter-mariadb` + `mariadb` driver) to handle MySQL/MariaDB connections efficiently.
- **Package Manager**: [pnpm](https://pnpm.io/) (utilizes `pnpm-workspace.yaml` and `pnpm-lock.yaml`).
- **Authentication**: [NextAuth.js v5](https://authjs.dev/) (`next-auth` beta) with credentials provider for secure `/admin` access.
- **Storage**: FTP Storage pipeline (via `basic-ftp`) with an automated local-to-FTP delivery fallback mechanism.
- **CRM Integration**: [LeadRat CRM API](https://connect.leadrat.com/) for automated sales lead ingestion.
- **Styling**: Tailwind CSS v4.

---

## 2. Prerequisites

Ensure you have the following installed on your local development machine:
1. **Node.js** (v20.x or higher recommended)
2. **pnpm** (v10.x or higher)
   - To install pnpm globally: `npm install -g pnpm`
3. **Docker & Docker Compose** (Optional, if using the containerized local setup)
4. A running **MySQL** or **MariaDB** database instance (or access to the Hostinger database)

---

## 3. Environment Variables Setup

Before running the application, copy the example environment file and configure your credentials:

```bash
cp .env.example .env
```

Open `.env` and fill in the values:

```ini
# Local MySQL/MariaDB connection string for Prisma (Hostinger Integration)
DATABASE_URL="mysql://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_DB_HOST:3306/YOUR_DB_NAME"

# Auth.js Configuration
# Generate a secret using `openssl rand -base64 33` or `npx auth secret`
AUTH_SECRET="your_next_auth_secret_here"
ADMIN_USER="admin"
ADMIN_PASSWORD="your_admin_password_here"
AUTH_TRUST_HOST=true

# FTP Upload Configuration (Hostinger)
# When set, uploads from localhost or the server will upload files directly to your live website filesystem via FTP.
FTP_HOST="your_ftp_host_here"
FTP_USER="your_ftp_user_here"
FTP_PASSWORD="your_ftp_password_here"
FTP_PORT=21
FTP_REMOTE_PATH="public/assets"

# LeadRat CRM API Configuration
LEADRAT_API_KEY="your_leadrat_api_key_here"
LEADRAT_ENDPOINT="https://connect.leadrat.com/api/v1/integration/Website"
```

---

## 4. Local Quick Start

Follow these steps to run the project in development mode:

### Step 1: Install Dependencies
Run the install command. This installs all packages and triggers the `postinstall` hook to generate the Prisma client.
```bash
pnpm install
```

### Step 2: Initialize / Push Database Schema
To prepare your database tables (`RoomType`, `Lead`, `HotelConfig`, `PromoBanner`) without creating manual migrations:
```bash
pnpm prisma db push
```

> [!IMPORTANT]
> The database URL and FTP server in the default `.env` point to live production environments. Do not overwrite, wipe, or push modifications to it until you have updated `.env` to target your new/staging database.

### Step 3: Run Seed Data (Optional)
If you want to seed the database with initial resort room types from the static configurations (`constants/default-room-types.ts`):
```bash
pnpm prisma db seed
```

### Step 4: Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Programmatic Prisma Config (Prisma 6 & 7)

This project uses programmatic configuration (`prisma.config.ts`) instead of hardcoding database URLs directly into `prisma/schema.prisma`. 

```ts
// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://mock:mock@localhost:5432/mock",
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});
```

Because of this, `prisma/schema.prisma` is kept cleaner:
```prisma
datasource db {
  provider = "mysql"
  // The 'url' property is injected dynamically via prisma.config.ts!
}
```

---

## 6. Docker Development Environment

A multi-container setup is pre-configured to launch a local MariaDB container and a Next.js production web server.

### Start the Container Stack
```bash
docker-compose up --build
```

### What happens under the hood?
1. `docker-compose` launches a MariaDB instance named `godrej-mariadb` exposing port `3306`.
2. The web application container waits for the database container to accept TCP requests.
3. The custom entrypoint script `entrypoint.sh` executes database sync automatically:
   ```bash
   npx prisma db push --accept-data-loss || npx prisma db push
   npx prisma db seed
   ```
4. Next.js starts its production server in multi-threaded runtime mode inside the container.

---

## 7. FTP Asset Management Pipeline

To keep the application light and avoid saving gigabytes of dynamic media files inside the git repository, the project uses an **FTP Asset Pipeline** located in `lib/storage/StorageService.ts`.

### Uploading Assets
1. When a user uploads a project image or RERA QR code via the Admin Dashboard, the request is routed to `StorageService`.
2. `StorageService` connects to the FTP server using the `FTP_HOST`, `FTP_USER`, and `FTP_PASSWORD` credentials.
3. It creates the remote folder hierarchy defined by `FTP_REMOTE_PATH`.
4. It uploads the media file with a unique filename and returns a relative URL structure like `/assets/[filename]`.

### Serving & Streaming Fallback Assets
Next.js dynamically handles asset serving using the file route: `app/assets/[filename]/route.ts`:
1. It looks for the file in the local `./public/assets/[filename]` directory first.
2. If the file is not found locally, it automatically connects to the FTP host.
3. It checks the primary path (`public/assets/[filename]`).
4. If not found in the primary path, it checks the legacy fallback path (`.builds/last-source/public/assets/[filename]`).
5. Once found, it downloads and streams the media buffer to the user's browser with aggressive caching headers.

---

## 8. Diagnostic & Utility Scripts

To assist in debugging and verifying external integrations, the project includes several command-line utility scripts. You can run them using `tsx`:

### A. Asset Verification Report
Scans all images referenced in your database and checks if they exist in either the primary or legacy folders of the FTP server.
```bash
pnpm tsx scripts/verify-assets.ts
```

### B. FTP Connection Check
Tests connection, logs into the FTP host, and prints the remote directory tree to diagnose configuration issues.
```bash
pnpm tsx scripts/test-upload-ftp.ts
```

### C. CRM API Integration Test
Pushes a mock contact lead to the configured LeadRat API endpoint to test the CRM lead pipeline.
```bash
pnpm tsx scripts/test-leadrat.ts
```

---

## 9. Next.js Route Reference

- `/` - Landing & Resort Room Showcase page.
- `/admin` - Dashboard main page (Leads list, room types editor, configs, promos).
- `/admin/login` - Admin Authentication form.
- `/api/leads` - Endpoint for submitting contact form leads.
- `/api/room-types` - Room type CRUD endpoint.
- `/api/hotel-config` - Hotel configurations endpoint.
- `/api/promo-banner` - Top Promotional banner upload / info endpoint.
- `/assets/[filename]` - Virtual FTP asset routing endpoint.
