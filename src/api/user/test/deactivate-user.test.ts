import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';

describe('User API - PUT DEACTIVATE /user/deactivate', () => {
  let prisma: PrismaClient;

  const createUser = async (payload: object) => {
    return await request(app).post('/user').send(payload);
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

  test('should not deactivate a non-existent user', async () => {
    const response = await deactivateUser(999999);

    expect(response.status).toBe(404);
  });

  test('should not deactivate a inactive user', async () => {
    const userResponse = await createUser({
      name: 'test',
      email: 'test-deactivate-user@test.test',
      password: 'S3nh@F0rt3',
    });

    await deactivateUser(userResponse.body.id);

    const response = await deactivateUser(userResponse.body.id);

    expect(response.status).toBe(412);
  });

  test('should deactivate a user', async () => {
    const userResponse = await createUser({
      name: 'test',
      email: 'test-deactivate-user-1@test.test',
      password: 'S3nh@F0rt3',
    });

    const response = await deactivateUser(userResponse.body.id);

    expect(response.status).toBe(200);
  });
});
