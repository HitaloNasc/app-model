import request from 'supertest';
import app from '../../app';
import { IUser } from '../../server/entities/user/user.entity';
import { PrismaClient } from '@prisma/client';

describe('Role  API - POST CREATE /role', () => {
  let prisma: PrismaClient;

  const createUser = async (payload: object) => {
    return await request(app).post('/user').send(payload);
  };

  const createRole = async (payload: object) => {
    return await request(app).post('/role').send(payload);
  };

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  let userExists: IUser;

  beforeEach(async () => {
    const responseUser = await createUser({
      name: 'test',
      email: 'test-create-role@test.test',
      password: 'S3nh@F0rt3',
    });

    userExists = responseUser.body;

    await createRole({
      name: 'test-exists',
      description: 'test',
      userId: userExists.id,
    });
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should not create a new role and return an exception for sending empty payload', async () => {
    const payload = {};
    const response = await createRole(payload);
    expect(response.status).toBe(412);
  });

  test('should not create a new role and return an exception for not sending name', async () => {
    const payload = {
      description: 'test',
      userId: userExists.id,
    };
    const response = await createRole(payload);
    expect(response.status).toBe(412);
  });

  test('should not create a new role and return an exception for not sending empty name', async () => {
    const payload = {
      name: '',
      description: 'test',
      userId: userExists.id,
    };
    const response = await createRole(payload);
    expect(response.status).toBe(412);
  });

  test('should not create a new role with already existing name', async () => {
    const payload = {
      name: 'test-exists',
      description: 'test',
      userId: userExists.id,
    };

    const response = await createRole(payload);
    expect(response.status).toBe(412);
  });

  test('should not create a new role and return an exception for sending a invalid userId', async () => {
    const payload = {
      name: 'test-userId',
      description: 'test',
      userId: 999999,
    };
    const response = await createRole(payload);
    expect(response.status).toBe(404);
  });

  test('should create a new role and return expected response for sending empty userId', async () => {
    const payload = {
      name: 'test-userId2',
      description: 'test',
    };
    const response = await createRole(payload);
    expect(response.status).toBe(200);
  });

  test('should create a new role and return the expected response', async () => {
    const payload = {
      name: 'test-new-role',
      description: 'test',
      userId: userExists.id,
    };

    const response = await createRole(payload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', payload.name);
    expect(response.body).toHaveProperty('description', payload.description);
    expect(response.body).toHaveProperty('userId', userExists.id);
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });
});
