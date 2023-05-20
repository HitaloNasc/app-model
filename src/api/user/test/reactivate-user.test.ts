import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';

describe('User API - PUT REACTIVATE /user/reactivate', () => {
  let prisma: PrismaClient;

  const createUser = async (payload: object) => {
    return await request(app).post('/user').send(payload);
  };

  const reactivateUser = async (id: number) => {
    return await request(app).put(`/user/reactivate/${id}`);
  };

  const deactivateUser = async (id: number) => {
    return await request(app).put(`/user/deactivate/${id}`);
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

  test('should not reactivate a non-existent user', async () => {
    const response = await reactivateUser(999999);

    expect(response.status).toBe(404);
  });

  test('should not reactivate a active user', async () => {
    const userResponse = await createUser({
      name: 'test',
      email: 'test-reactivate-user@test.test',
      password: 'S3nh@F0rt3',
    });

    const response = await reactivateUser(userResponse.body.id);

    expect(response.status).toBe(412);
  });

  test('should reactivate a user', async () => {
    const userResponse = await createUser({
      name: 'test',
      email: 'test-reactivate-user-1@test.test',
      password: 'S3nh@F0rt3',
    });

    await deactivateUser(userResponse.body.id);

    const response = await reactivateUser(userResponse.body.id);

    expect(response.status).toBe(200);
  });
});
