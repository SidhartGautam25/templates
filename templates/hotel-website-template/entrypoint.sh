#!/bin/sh

# Exit on error
set -e

echo "Waiting for MySQL/MariaDB to start..."
until nc -z db 3306; do
  echo "Database is unavailable - sleeping"
  sleep 1
done

echo "Database is up - running Prisma database push"
npx prisma db push --accept-data-loss || npx prisma db push

echo "Running Database Seeding"
# We run DB seed. The seed script should check if records exist to avoid duplicates,
npx prisma db seed || echo "Seeding script failed or skipped"

echo "Starting Next.js production server"
pnpm run start
