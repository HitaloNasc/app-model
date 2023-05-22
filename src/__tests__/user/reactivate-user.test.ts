/* eslint-disable @typescript-eslint/no-non-null-assertion */
import request from 'supertest';
import app from '../../app';
import { STATUS } from '../../server/services/user/consts/user-status.consts';
import { PrismaClient } from '@prisma/client';
import { IUser } from '../../server/entities/user/user.entity';

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

  let userTest: IUser;
  beforeEach(async () => {
    const response = await createUser({
      name: 'test',
      email: 'test-reactivate-user@test.test',
      password: 'S3nh@F0rt3',
    });

    userTest = response.body;
  });

  afterEach(async () => {
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
    const response = await reactivateUser(userTest.id!);

    expect(response.status).toBe(412);
  });

  test('should reactivate a user', async () => {
    await deactivateUser(userTest.id!);

    const response = await reactivateUser(userTest.id!);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', STATUS.ACTIVE);
  });
});
