# Run Dockerized Service Locally
# This script builds and runs your application using Docker

Write-Host "🚀 Starting Dockerized Service..." -ForegroundColor Cyan

# Set environment variables
$env:SECRET_MESSAGE = "This is my secret message!"
$env:USERNAME = "admin"
$env:PASSWORD = "password123"
$env:PORT = "3001"

# Stop and remove existing container if running
Write-Host "🛑 Stopping existing container..." -ForegroundColor Yellow
docker stop dockerized-service 2>$null
docker rm dockerized-service 2>$null

# Build Docker image
Write-Host "🔨 Building Docker image..." -ForegroundColor Yellow
docker build -t dockerized-service:local .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build Docker image" -ForegroundColor Red
    exit 1
}

# Run container
Write-Host "🐳 Starting Docker container..." -ForegroundColor Yellow
docker run -d `
    --name dockerized-service `
    -p 3001:3001 `
    -e SECRET_MESSAGE="$env:SECRET_MESSAGE" `
    -e USERNAME="$env:USERNAME" `
    -e PASSWORD="$env:PASSWORD" `
    -e PORT="$env:PORT" `
    dockerized-service:local

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start container" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Service is running!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access your service at:" -ForegroundColor Cyan
Write-Host "   http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Basic Auth Credentials:" -ForegroundColor Cyan
Write-Host "   Username: $env:USERNAME" -ForegroundColor White
Write-Host "   Password: $env:PASSWORD" -ForegroundColor White
Write-Host ""
Write-Host "📝 Useful commands:" -ForegroundColor Cyan
Write-Host "   View logs:    docker logs dockerized-service" -ForegroundColor White
Write-Host "   Stop service: docker stop dockerized-service" -ForegroundColor White
Write-Host "   Remove:       docker rm dockerized-service" -ForegroundColor White
Write-Host ""
