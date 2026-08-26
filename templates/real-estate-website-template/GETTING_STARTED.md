# Getting started — Greenfield Properties (real estate template)

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
   MariaDB on `localhost:3306` — root password `password`, database `app_db`.

   **Or** run `tempjs init-db` to configure `.env` and push the schema.

4. **Sync schema and seed demo listings**
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

Or run **`tempjs doctor`** for a full local checklist (Node, `.env`, DB, dependencies, template version).

## Next steps

- Edit **`constants/site.ts`** for brand and compliance copy.
- Edit **`constants/default-projects.ts`** or use Admin to add listings.
- See [ARCHITECTURE.md](./ARCHITECTURE.md) and [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md).
