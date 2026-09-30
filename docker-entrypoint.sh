#!/bin/sh
set -e

echo "Initialising PostgreSQL database schema..."
npx prisma db init

echo "Starting Next.js application..."
exec "$@"