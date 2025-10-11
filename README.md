# Dockerized Service

A Dockerized Node.js Service with CI/CD Pipeline

## Features

- **Node.js Express Server**: Simple REST API with two endpoints
- **Docker Support**: Fully containerized application
- **Basic Authentication**: Protected endpoint with username/password auth
- **CI/CD Pipeline**: Automated testing and Docker image building with GitHub Actions
- **Local Development**: Easy-to-use PowerShell scripts for running locally

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
docker run -d --name dockerized-service -p 3001:3001 \
  -e SECRET_MESSAGE="Your secret" \
  -e USERNAME="admin" \
  -e PASSWORD="password123" \
  -e PORT="3001" \
  dockerized-service:local

# View logs
docker logs dockerized-service

# Stop and remove
docker stop dockerized-service
docker rm dockerized-service
```

> **Note:** The default port is 3001 to avoid conflicts with other services.

### Testing the API

#### Test public endpoint:
```bash
curl http://localhost:3001
```

#### Test protected endpoint:
```bash
curl -u admin:password123 http://localhost:3001/secret
```

**PowerShell example:**
```powershell
# Test public endpoint
Invoke-RestMethod -Uri "http://localhost:3001" -Method Get

# Test protected endpoint
$pair = "admin:password123"
$bytes = [System.Text.Encoding]::ASCII.GetBytes($pair)
$base64 = [System.Convert]::ToBase64String($bytes)
$headers = @{ Authorization = "Basic $base64" }
Invoke-RestMethod -Uri "http://localhost:3001/secret" -Method Get -Headers $headers
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

## CI/CD Pipeline

This project uses GitHub Actions for automated testing and Docker image building.

### Workflow Overview

When you push to the `main` or `master` branch, GitHub Actions will automatically:

1. **Run Tests** - Execute the test suite with `npm test`
2. **Build Docker Image** - Build the Docker image for your application
3. **Push to Registry** - Push the image to GitHub Container Registry (ghcr.io)

### Accessing Built Images

After a successful workflow run, your Docker image will be available at:
```
ghcr.io/jems0906/dockerized-service:latest
```

You can pull and run it:
```bash
# Pull the image from GitHub Container Registry
docker pull ghcr.io/jems0906/dockerized-service:latest

# Run the image
docker run -d -p 3001:3001 \
  -e SECRET_MESSAGE="Your secret" \
  -e USERNAME="admin" \
  -e PASSWORD="password123" \
  -e PORT="3001" \
  ghcr.io/jems0906/dockerized-service:latest
```

### GitHub Actions Workflow

The workflow automatically runs on:
- Push to `main` or `master` branches
- Pull requests to `main` or `master` branches

No additional secrets or configuration needed for basic CI/CD!

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
├── run-local.ps1             # PowerShell script to run locally
├── stop-local.ps1            # PowerShell script to stop service
├── server.js                 # Main application file
└── README.md                 # This file
```

## Security Notes

- The `.env` file is not committed to version control
- Use strong passwords in production
- Consider using HTTPS in production

## Project Reflection

### Architecture

In building this Dockerized service, I explored several approaches to containerization and deployment. Docker provided a consistent environment across development and production, ensuring that the application runs the same way regardless of where it's deployed. The containerized approach simplified dependency management and made the application portable and easy to scale.

For the backend, I chose Node.js with Express because of its lightweight nature and excellent performance for building REST APIs. Express's middleware architecture made it straightforward to implement features like basic authentication and JSON parsing. The simplicity of Express allowed for rapid development while maintaining clean, readable code that's easy to maintain and extend.

The CI/CD pipeline uses GitHub Actions, which integrates seamlessly with GitHub repositories. This approach automates the testing and building process, ensuring that every commit is validated before being deployed. The workflow builds Docker images and pushes them to GitHub Container Registry, making it easy to distribute and deploy the application across different environments.

### Functionality

JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for both humans and machines to read and write. In this project, JSON serves as the communication format between the API and its clients. All API responses are returned as JSON, providing a consistent and structured way to exchange data. This makes the API easy to consume from various clients, whether they're web browsers, mobile apps, or other services.

Throughout the development process, I implemented security features like Basic Authentication to protect sensitive endpoints. The authentication middleware validates credentials before allowing access to protected resources. I also followed Docker best practices by creating a non-root user for the container, implementing multi-stage builds (where applicable), and keeping the image size minimal by using Alpine Linux as the base image.

### Testing

Automated API testing is extremely valuable for ensuring the reliability and correctness of the application. By developing a comprehensive test suite using Jest and Supertest, I can quickly verify that all endpoints work as expected. Unit tests validate individual functions and endpoints, while integration tests ensure that different parts of the application work together correctly.

The automated tests run on every push through the GitHub Actions workflow, catching bugs early in the development cycle before they reach production. This continuous testing approach saves time and reduces the risk of introducing breaking changes. The tests verify authentication mechanisms, ensure proper status codes are returned, and validate response data structures. By continuously running these tests, I can confidently make changes knowing that any regressions will be caught immediately.

### Reflection

This project has been instrumental in helping me develop practical DevOps and containerization skills. I have gained hands-on experience with Docker containerization, building efficient Dockerfiles, and managing containerized applications. The experience of setting up a complete CI/CD pipeline with GitHub Actions has given me a deeper understanding of automation and modern development workflows.

I have developed skills in designing REST APIs, implementing secure authentication, and writing clean, maintainable code. The experience of troubleshooting deployment issues and configuring the development environment has made me more confident in handling real-world software development challenges. Most importantly, I have learned the value of automation, testing, and documentation—skills that are essential for success in any software development role.

Working through the challenges of containerization, CI/CD configuration, and local development setup has reinforced the importance of understanding the entire application lifecycle, from development to deployment. This holistic understanding makes me a more versatile and effective developer.

## License

MIT License