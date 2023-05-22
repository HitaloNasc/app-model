/* eslint-disable @typescript-eslint/no-non-null-assertion */
import request from 'supertest';
import app from '../../app';
import { STATUS } from '../../server/services/user/consts/user-status.consts';
import { PrismaClient } from '@prisma/client';
import { IUser } from '../../server/entities/user/user.entity';

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

  let userTest: IUser;
  beforeEach(async () => {
    const response = await createUser({
      name: 'test',
      email: 'test-deactivate-user@test.test',
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

  test('should not deactivate a non-existent user', async () => {
    const response = await deactivateUser(999999);
    expect(response.status).toBe(404);
  });

  test('should not deactivate a inactive user', async () => {
    await deactivateUser(userTest.id!);
    const response = await deactivateUser(userTest.id!);
    expect(response.status).toBe(412);
  });

  test('should deactivate a user', async () => {
    const response = await deactivateUser(userTest.id!);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', STATUS.INACTIVE);
  });
});
