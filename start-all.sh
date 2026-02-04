#!/bin/bash

# Script to start all CFE project services

echo "Starting CFE Project..."

# 1. Start Docker Database
echo "Starting MySQL database via Docker..."
docker compose -f docker/docker-compose.yml up -d

# 2. Start Backend
echo "Starting Backend (NestJS)..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi
# Run in background
npm run start:dev &
BACKEND_PID=$!
cd ..

# 3. Start Mobile
echo "Starting Mobile (Expo)..."
cd mobile
if [ ! -d "node_modules" ]; then
    echo "Installing mobile dependencies..."
    npm install
fi
# Run in background
npm run android &
MOBILE_PID=$!
cd ..

echo "All services are starting!"
echo "- Database: localhost:3307"
echo "- Backend: http://localhost:3000 (PID: $BACKEND_PID)"
echo "- Mobile Web: http://localhost:8081 (PID: $MOBILE_PID)"
echo ""
echo "Press Ctrl+C to stop this script (Note: background processes might need manual termination if they don't catch the signal)."

# Wait for background processes
wait $BACKEND_PID $MOBILE_PID
