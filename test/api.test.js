const request = require('supertest');

// Set up test environment variables before requiring the app
process.env.SECRET_MESSAGE = 'Test secret message';
process.env.USERNAME = 'testuser';
process.env.PASSWORD = 'testpass';

const app = require('../server');

let server;

beforeAll((done) => {
  server = app.listen(0, done); // Use port 0 for random available port
});

afterAll((done) => {
  server.close(done);
});

describe('Dockerized Service API', () => {
  describe('GET /', () => {
    it('should return Hello, world! message', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.body.message).toBe('Hello, world!');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body.status).toBe('healthy');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('GET /secret', () => {
    it('should require authentication', async () => {
      await request(app)
        .get('/secret')
        .expect(401);
    });

    it('should return secret message with valid credentials', async () => {
      const credentials = Buffer.from('testuser:testpass').toString('base64');
      
      const response = await request(app)
        .get('/secret')
        .set('Authorization', `Basic ${credentials}`)
        .expect(200);
      
      expect(response.body.authenticated).toBe(true);
      expect(response.body.message).toBe('Test secret message');
    });

    it('should reject invalid credentials', async () => {
      const credentials = Buffer.from('wrong:credentials').toString('base64');
      
      await request(app)
        .get('/secret')
        .set('Authorization', `Basic ${credentials}`)
        .expect(401);
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);
      
      expect(response.body.error).toBe('Route not found');
    });
  });
});