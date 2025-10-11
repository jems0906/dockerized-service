# Stop Dockerized Service
# This script stops and removes the Docker container

Write-Host "🛑 Stopping Dockerized Service..." -ForegroundColor Yellow

docker stop dockerized-service
docker rm dockerized-service

Write-Host "✅ Service stopped and removed" -ForegroundColor Green
