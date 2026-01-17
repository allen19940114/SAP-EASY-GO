#!/bin/bash

echo "🚀 Starting OLORA Development Environment..."

# Start Docker services (databases only)
echo "📦 Starting Docker services (PostgreSQL, Redis, Qdrant)..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if services are running
echo "✅ Checking service status..."
docker-compose ps

echo ""
echo "======================================"
echo "✅ Development environment is ready!"
echo "======================================"
echo ""
echo "📚 Services:"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo "  - Qdrant: localhost:6333"
echo ""
echo "🏃 Next steps:"
echo "  1. Run 'pnpm dev' to start backend & frontend"
echo "  2. Backend: http://localhost:3000"
echo "  3. Frontend: http://localhost:3001"
echo ""
