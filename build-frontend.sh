#!/bin/bash

# Build frontend Docker image

echo "Building frontend Docker image..."

cd app

docker build -t mybank/frontend:latest .

echo "Frontend image built successfully!"

cd ..
