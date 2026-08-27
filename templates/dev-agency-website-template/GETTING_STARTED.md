# Getting started

1. `pnpm install`
2. `cp .env.example .env` and set `DATABASE_URL`, `ADMIN_USER`, `ADMIN_PASSWORD`
3. `docker compose up -d` (or configure your own MariaDB)
4. `pnpm prisma db push && pnpm prisma db seed`
5. `pnpm dev` → open http://localhost:3000/admin

Edit `constants/site.ts` for brand and contact. Add pages under `app/` and features under `lib/features/`.
