# Getting started — Lakeside Haven (hotel template)

Follow these steps in order. Total time: ~5 minutes with Docker.

## Checklist

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Set at minimum: `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_USER`, `ADMIN_PASSWORD`.

3. **Start the database**
   ```bash
   docker compose up -d
   ```
   Uses MariaDB on `localhost:3306` with root password `password` and database `app_db`.

   **Or** run `tempjs init-db` to create `.env` and push the schema interactively.

4. **Sync schema and seed demo data**
   ```bash
   pnpm prisma db push
   pnpm prisma db seed
   ```

5. **Run the dev server**
   ```bash
   pnpm dev
   ```

6. **Open the admin portal**
   - Site: [http://localhost:3000](http://localhost:3000)
   - Admin: [http://localhost:3000/admin](http://localhost:3000/admin)
   - Login with `ADMIN_USER` and `ADMIN_PASSWORD` from your `.env`

## Health check

```bash
curl -s http://localhost:3000/api/health | jq
```

Expect `status: "ok"` when required env vars are set and the database is reachable.

## Next steps

- Edit **`constants/site.ts`** for brand and copy.
- See [ARCHITECTURE.md](./ARCHITECTURE.md) for where pages and APIs live.
- See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for FTP uploads and LeadRat CRM.
