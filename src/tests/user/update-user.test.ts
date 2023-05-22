/* eslint-disable @typescript-eslint/no-non-null-assertion */
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../../app';
import { STATUS } from '../../server/services/user/consts/user-status.consts';
import { IUser } from '../../server/entities/user/user.entity';

describe('User API - PUT UPDATE /user', () => {
  let prisma: PrismaClient;

  const createUser = async (payload: object) => {
    return await request(app).post('/user').send(payload);
  };

  const updateUser = async (id: number, payload: object) => {
    return await request(app).put(`/user/${id}`).send(payload);
  };

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  let userTest1: IUser;
  let userTest2: IUser;
  beforeEach(async () => {
    const [response1, response2] = await Promise.all([
      createUser({
        name: 'test',
        email: 'test-update-1@test.test',
        password: 'S3nh@F0rt3',
      }),
      createUser({
        name: 'test',
        email: 'test-update-2@test.test',
        password: 'S3nh@F0rt3',
      }),
    ]);

    userTest1 = response1.body;
    userTest2 = response2.body;
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should not update a non-existent user', async () => {
    const response = await updateUser(999999, {});
    expect(response.status).toBe(404);
  });

  test('should not update a user with a existent email', async () => {
    const response = await updateUser(userTest2.id!, {
      email: userTest1.email,
    });
    expect(response.status).toBe(412);
  });

  test('should not update a user with a invalid email', async () => {
    const response = await updateUser(userTest1.id!, {
      email: 'test',
    });
    expect(response.status).toBe(412);
  });

  test('should not update a user with a weak password', async () => {
    const response = await updateUser(userTest1.id!, {
      password: 'test',
    });
    expect(response.status).toBe(412);
  });

  test('should update a user and return the expected response', async () => {
    const payload = {
      name: 'test2',
      email: 'test-update-66@test.test',
    };

    const response = await updateUser(userTest1.id!, payload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', payload.name);
    expect(response.body).toHaveProperty('email', payload.email);
    expect(response.body).toHaveProperty('status', STATUS.ACTIVE);
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });
});
