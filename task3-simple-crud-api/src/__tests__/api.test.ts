import request from 'supertest';
import http from 'http';
import { createServer } from '../server';
import { setUsers } from '../db/in-memory-db';
// Jest types are implicitly imported via tsconfig

describe('CRUD API Tests', () => {
  let server: http.Server;
  const TEST_PORT = 4001;
  let createdUserId: string;

  beforeAll(() => {
    // Clear any existing data
    setUsers([]);
    server = createServer(TEST_PORT);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('GET /api/users should return an empty array initially', async () => {
    const response = await request(`http://localhost:${TEST_PORT}`)
      .get('/api/users');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('POST /api/users should create a new user', async () => {
    const userData = {
      username: 'John Doe',
      age: 30,
      hobbies: ['reading', 'hiking']
    };

    const response = await request(`http://localhost:${TEST_PORT}`)
      .post('/api/users')
      .send(userData);
    
    expect(response.status).toBe(201);
    expect(response.body.username).toBe(userData.username);
    expect(response.body.age).toBe(userData.age);
    expect(response.body.hobbies).toEqual(userData.hobbies);
    expect(response.body.id).toBeTruthy();
    
    // Save the ID for subsequent tests
    createdUserId = response.body.id;
  });

  it('GET /api/users/{userId} should return the created user', async () => {
    const response = await request(`http://localhost:${TEST_PORT}`)
      .get(`/api/users/${createdUserId}`);
    
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdUserId);
    expect(response.body.username).toBe('John Doe');
  });

  it('PUT /api/users/{userId} should update the user', async () => {
    const updateData = {
      username: 'Jane Doe',
      age: 31,
      hobbies: ['reading', 'hiking', 'coding']
    };

    const response = await request(`http://localhost:${TEST_PORT}`)
      .put(`/api/users/${createdUserId}`)
      .send(updateData);
    
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdUserId);
    expect(response.body.username).toBe(updateData.username);
    expect(response.body.age).toBe(updateData.age);
    expect(response.body.hobbies).toEqual(updateData.hobbies);
  });

  it('DELETE /api/users/{userId} should delete the user', async () => {
    const response = await request(`http://localhost:${TEST_PORT}`)
      .delete(`/api/users/${createdUserId}`);
    
    expect(response.status).toBe(204);
  });

  it('GET /api/users/{userId} should return 404 after user is deleted', async () => {
    const response = await request(`http://localhost:${TEST_PORT}`)
      .get(`/api/users/${createdUserId}`);
    
    expect(response.status).toBe(404);
  });

  it('GET /api/users/{invalidId} should return 400 for invalid UUID', async () => {
    const response = await request(`http://localhost:${TEST_PORT}`)
      .get('/api/users/invalid-id');
    
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Invalid user ID format');
  });

  it('POST /api/users should return 400 if required fields are missing', async () => {
    const incompleteData = {
      username: 'Test User'
      // Missing age and hobbies
    };

    const response = await request(`http://localhost:${TEST_PORT}`)
      .post('/api/users')
      .send(incompleteData);
    
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Missing required fields');
  });

  it('PUT /api/users/{invalidId} should return 400 for invalid UUID', async () => {
    const updateData = {
      username: 'Updated Name'
    };

    const response = await request(`http://localhost:${TEST_PORT}`)
      .put('/api/users/invalid-id')
      .send(updateData);
    
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Invalid user ID format');
  });

  it('DELETE /api/users/{invalidId} should return 400 for invalid UUID', async () => {
    const response = await request(`http://localhost:${TEST_PORT}`)
      .delete('/api/users/invalid-id');
    
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Invalid user ID format');
  });

  it('Requesting a non-existing endpoint should return 404', async () => {
    const response = await request(`http://localhost:${TEST_PORT}`)
      .get('/api/some-non-existing-endpoint');
    
    expect(response.status).toBe(404);
    expect(response.body.message).toContain('Endpoint not found');
  });
});