#!/bin/bash

# Database initialization script

set -e

echo "Initializing database..."

# Wait for database to be ready
echo "Waiting for database to be ready..."
while ! pg_isready -h ${POSTGRES_HOST:-localhost} -p ${POSTGRES_PORT:-5432} -U ${POSTGRES_USER:-postgres}; do
  sleep 1
done

echo "Database is ready!"

# Run migrations
echo "Running database migrations..."
poetry run alembic upgrade head

echo "Database initialization complete!"
