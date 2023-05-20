import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';

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

  beforeEach(async () => {
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
    await createUser({
      name: 'test',
      email: 'test-update-1@test.test',
      password: 'S3nh@F0rt3',
    });

    const userResponse = await createUser({
      name: 'test',
      email: 'test-update-2@test.test',
      password: 'S3nh@F0rt3',
    });

    const response = await updateUser(userResponse.body.id, {
      email: 'test-update-1@test.test',
    });
    expect(response.status).toBe(412);
  });

  test('should not update a user with a invalid email', async () => {
    const userResponse = await createUser({
      name: 'test',
      email: 'test-update-1@test.test',
      password: 'S3nh@F0rt3',
    });

    const response = await updateUser(userResponse.body.id, {
      email: 'test',
    });
    expect(response.status).toBe(412);
  });

  test('should not update a user with a weak password', async () => {
    const userResponse = await createUser({
      name: 'test',
      email: 'test-update-1@test.test',
      password: 'S3nh@F0rt3',
    });

    const response = await updateUser(userResponse.body.id, {
      password: 'test',
    });
    expect(response.status).toBe(412);
  });

  test('should update a user and return the expected response', async () => {
    const userResponse = await createUser({
      name: 'test',
      email: 'test-update-1@test.test',
      password: 'S3nh@F0rt3',
    });

    const payload = {
      name: 'test2',
      email: 'test-update-2@test.test',
    };

    const response = await updateUser(userResponse.body.id, payload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', payload.name);
    expect(response.body).toHaveProperty('email', payload.email);
    expect(response.body).toHaveProperty('password');
    expect(response.body).toHaveProperty('status', 1);
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });
});
