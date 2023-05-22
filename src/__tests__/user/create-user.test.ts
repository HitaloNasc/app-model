import request from 'supertest';
import app from '../../app';
import { STATUS } from '../../server/services/user/consts/user-status.consts';
import { PrismaClient } from '@prisma/client';

describe('User API - POST CREATE /user', () => {
  let prisma: PrismaClient;

  const createUser = async (payload: object) => {
    return await request(app).post('/user').send(payload);
  };

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  beforeEach(async () => {
    await createUser({
      name: 'test',
      email: 'test-create-exists@test.test',
      password: 'S3nh@F0rt3',
    });
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should not create a new user and return an exception for sending empty payload', async () => {
    const payload = {};
    const response = await createUser(payload);
    expect(response.status).toBe(412);
  });

  test('should not create a new user and return an exception for not sending name', async () => {
    const payload = {
      email: 'test-create@test.test',
      password: 'S3nh@F0rt3',
    };
    const response = await createUser(payload);
    expect(response.status).toBe(412);
  });

  test('should not create a new user and return an exception for not sending email', async () => {
    const payload = {
      name: 'test',
      password: 'S3nh@F0rt3',
    };
    const response = await createUser(payload);
    expect(response.status).toBe(412);
  });

  test('should not create a new user and return an exception for sending a invalid email', async () => {
    const payload = {
      name: 'test',
      email: 'test',
      password: 'S3nh@F0rt3',
    };
    const response = await createUser(payload);
    expect(response.status).toBe(412);
  });

  test('should not create a new user and return an exception for not sending password', async () => {
    const payload = {
      name: 'test',
      email: 'test-create@test.test',
    };
    const response = await createUser(payload);
    expect(response.status).toBe(412);
  });

  test('should not create a new user and return an exception for sending a invalid password', async () => {
    const payload = {
      name: 'test',
      email: 'test',
      password: 'senha',
    };
    const response = await createUser(payload);
    expect(response.status).toBe(412);
  });

  test('should not create a new user with already existing email', async () => {
    const payload = {
      name: 'test',
      email: 'test-create-exists@test.test',
      password: 'S3nh@F0rt3',
    };

    const response = await createUser(payload);
    expect(response.status).toBe(412);
  });

  test('should create a new user and return the expected response', async () => {
    const payload = {
      name: 'test',
      email: 'test-create@test.test',
      password: 'S3nh@F0rt3',
    };

    const response = await createUser(payload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', payload.name);
    expect(response.body).toHaveProperty('email', payload.email);
    expect(response.body).toHaveProperty('status', STATUS.ACTIVE);
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });
});
