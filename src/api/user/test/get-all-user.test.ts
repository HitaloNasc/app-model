import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';

describe('User API - GET ALL /user', () => {
  let prisma: PrismaClient;

  const createUser = async (payload: object) => {
    return await request(app).post('/user').send(payload);
  };

  const getAll = async () => {
    return await request(app).get('/user');
  };

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should not return users', async () => {
    const response = await getAll();

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test('should return users found', async () => {
    await createUser({
      name: 'test',
      email: 'test-get-all-user-1@test.test',
      password: 'S3nh@F0rt3',
    });

    await createUser({
      name: 'test',
      email: 'test-get-all-user-2@test.test',
      password: 'S3nh@F0rt3',
    });

    const response = await getAll();

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });
});
