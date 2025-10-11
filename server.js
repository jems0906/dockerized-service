const express = require('express');
const dotenv = require('dotenv');
const os = require('os');

// Load environment variables
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Basic Auth middleware for protected routes
const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Protected Area"');
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    const credentials = Buffer.from(authHeader.slice(6), 'base64').toString('utf8');
    const [username, password] = credentials.split(':');
    
    const validUsername = process.env.USERNAME;
    const validPassword = process.env.PASSWORD;
    
    if (username === validUsername && password === validPassword) {
        next();
    } else {
        res.setHeader('WWW-Authenticate', 'Basic realm="Protected Area"');
        return res.status(401).json({ error: 'Invalid credentials' });
    }
};

// Public route - returns "Hello, world!"
app.get('/', (req, res) => {
    res.json({ message: 'Hello, world!' });
});

// Protected route - returns secret message with Basic Auth
app.get('/secret', basicAuth, (req, res) => {
    const secretMessage = process.env.SECRET_MESSAGE;
    res.json({ 
        message: secretMessage || 'No secret message configured',
        authenticated: true 
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Endpoint to get server hostname
app.get('/hostname', (req, res) => {
    res.json({ hostname: os.hostname() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Only start the server if this file is run directly (not required by tests)
if (require.main === module) {
    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Access the service at http://localhost:${PORT}`);
        console.log(`Secret endpoint at http://localhost:${PORT}/secret (requires Basic Auth)`);
    });

    // Add error handling for EADDRINUSE
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use. Please stop the other process or use a different port.`);
            process.exit(1);
        } else {
            throw err;
        }
    });
}

module.exports = app;