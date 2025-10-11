# Dockerized Service

Use GitHub Actions to Deploy a Dockerized Node.js Service

## Features

- **Node.js Express Server**: Simple REST API with two endpoints
- **Docker Support**: Fully containerized application
- **Basic Authentication**: Protected endpoint with username/password auth
- **CI/CD Pipeline**: Automated building and deployment with GitHub Actions

## API Endpoints

- `GET /` - Returns "Hello, world!" message
- `GET /secret` - Returns secret message (requires Basic Auth)

## Local Development

### Prerequisites

- Node.js 18 or higher
- npm
- Docker (for containerized deployment)

### Option 1: Run with Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```env
   SECRET_MESSAGE=Your secret message here
   USERNAME=your_username
   PASSWORD=your_password
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:3000`

### Option 2: Run with Docker (Recommended)

**Windows PowerShell:**
```powershell
.\run-local.ps1
```

This script will:
- Build the Docker image
- Start the container with environment variables
- Display the service URL and credentials

**To stop the service:**
```powershell
.\stop-local.ps1
```

**Manual Docker commands:**
```bash
# Build the image
docker build -t dockerized-service:local .

# Run the container
docker run -d --name dockerized-service -p 3000:3000 \
  -e SECRET_MESSAGE="Your secret" \
  -e USERNAME="admin" \
  -e PASSWORD="password123" \
  dockerized-service:local

# View logs
docker logs dockerized-service

# Stop and remove
docker stop dockerized-service
docker rm dockerized-service
```

### Testing the API

#### Test public endpoint:
```bash
curl http://localhost:3000
```

#### Test protected endpoint:
```bash
curl -u username:password http://localhost:3000/secret
```

## Docker

### Build the image:
```bash
docker build -t dockerized-service .
```

### Run the container:
```bash
docker run -p 3000:3000 --env-file .env dockerized-service
```

### Using Docker Compose:
```bash
docker-compose up -d
```

## Deployment

This project includes automated CI/CD deployment to remote servers using GitHub Actions.

### GitHub Actions Secrets

Configure these secrets in your GitHub repository (Settings → Secrets and variables → Actions):

#### Server Connection
- `HOST` - Server IP address
- `USERNAME` - SSH username
- `PRIVATE_KEY` - SSH private key content
- `PORT` - SSH port (usually 22)

#### Application Configuration
- `SECRET_MESSAGE` - Production secret message
- `AUTH_USERNAME` - Production username for Basic Auth
- `AUTH_PASSWORD` - Production password for Basic Auth

### Server Setup

On your remote Ubuntu server:

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Configure firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
```

Push to the main branch to trigger deployment.

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD pipeline
├── test/
│   └── api.test.js            # Test suite
├── .dockerignore              # Docker ignore file
├── .env                       # Environment variables (local)
├── .env.example              # Environment template
├── .gitignore                # Git ignore file
├── docker-compose.yml        # Docker Compose configuration
├── Dockerfile                # Docker image configuration
├── package.json              # Node.js dependencies and scripts
├── server.js                 # Main application file
└── README.md                 # This file
```

## Security Notes

- The `.env` file is not committed to version control
- Use strong passwords in production
- Consider using HTTPS in production

## License

MIT License