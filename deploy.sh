#!/bin/bash

# Deploy script for neuralcosmology.com
# This script should be placed on your Digital Ocean droplet

set -e

echo "🚀 Starting deployment..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

# Navigate to project directory
cd /opt/neurocosmology

# Create acme.json file for Let's Encrypt certificates if it doesn't exist
if [ ! -f acme.json ]; then
    echo "📝 Creating acme.json for SSL certificates..."
    touch acme.json
    chmod 600 acme.json
fi

# Pull latest images
echo "📦 Pulling latest Docker images..."
docker-compose pull

# Stop running containers
echo "🛑 Stopping running containers..."
docker-compose down

# Start new containers
echo "▶️ Starting new containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check if services are running
echo "🔍 Checking service status..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    echo "📊 Service status:"
    docker-compose ps
    echo ""
    echo "🌐 Your site should be available at:"
    echo "   - https://neuralcosmology.com"
    echo "   - https://www.neuralcosmology.com"
    echo "   - Traefik dashboard: https://traefik.neuralcosmology.com (admin/admin)"
else
    echo "❌ Deployment failed!"
    echo "📋 Container logs:"
    docker-compose logs --tail=50
    exit 1
fi

# Clean up unused images and containers
echo "🧹 Cleaning up..."
docker system prune -f

echo "🎉 Deployment completed successfully!"




