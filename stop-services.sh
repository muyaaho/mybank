#!/bin/bash

# MyBank 360 - Service Shutdown Script

echo "🛑 Stopping MyBank 360 Services..."

# Stop Docker Compose services
echo "Stopping Docker infrastructure..."
docker-compose down

echo ""
echo "✅ All services stopped"
echo ""
echo "To remove volumes (WARNING: This will delete all data):"
echo "  docker-compose down -v"
