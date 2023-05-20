import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';

describe('User API - GET BY ID /user', () => {
  let prisma: PrismaClient;

  const createUser = async (payload: object) => {
    return await request(app).post('/user').send(payload);
  };

  const getById = async (id: number) => {
    return await request(app).get(`/user/${id}`);
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

  test('should return user found', async () => {
    const user = await createUser({
      name: 'test',
      email: 'test-get-by-id@test.test',
      password: 'S3nh@F0rt3',
    });

    const response = await getById(user.body.id);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });

  test('should return user not found', async () => {
    const response = await getById(999999);
    expect(response.statusCode).toBe(404);
  });
});
