import request from 'supertest';
import app from '../../app';
import { IUser } from '../../server/entities/user/user.entity';
import { IRole } from '../../server/entities/role/role.entity';
import { PrismaClient } from '@prisma/client';

describe('Permission  API - POST CREATE /permission', () => {
  let prisma: PrismaClient;

  const createUser = async (payload: object) => {
    return await request(app).post('/user').send(payload);
  };

  const createRole = async (payload: object) => {
    return await request(app).post('/role').send(payload);
  };

  const createPermission = async (payload: object) => {
    return await request(app).post('/permission').send(payload);
  };

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  let userExists: IUser;
  let roleExists: IRole;

  beforeEach(async () => {
    const responseUser = await createUser({
      name: 'test-permission',
      email: 'test-create-permission@test.test',
      password: 'S3nh@F0rt3',
    });
    userExists = responseUser.body;

    const responseRole = await createRole({
      name: 'test-permission',
      description: 'test',
      userId: userExists.id,
    });
    roleExists = responseRole.body;

    await createPermission({
      name: 'test-exists',
      description: 'test',
      resource: 'permission',
      roleId: roleExists.id,
    });
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    await prisma.permission.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should not create a new permission and return an exception for sending empty payload', async () => {
    const payload = {};
    const response = await createPermission(payload);
    expect(response.status).toBe(412);
  });

  test('should not create a new permission and return an exception for not sending name', async () => {
    const payload = {
      description: 'test',
      resource: 'permission',
      roleId: roleExists.id,
    };
    const response = await createPermission(payload);
    expect(response.status).toBe(412);
  });

  test('should not create a new permission and return an exception for sending empty name', async () => {
    const payload = {
      name: '',
      description: 'test',
      resource: 'permission',
      roleId: roleExists.id,
    };
    const response = await createPermission(payload);
    expect(response.status).toBe(412);
  });

  test('should not create a new permission with already existing name', async () => {
    const payload = {
      name: 'test-exists',
      description: 'test',
      resource: 'permission',
      roleId: roleExists.id,
    };
    const response = await createPermission(payload);
    expect(response.status).toBe(412);
  });

  test('should not create a new permission and return an exception for not sending resource', async () => {
    const payload = {
      name: 'test-resource',
      description: 'test',
      roleId: roleExists.id,
    };
    const response = await createPermission(payload);
    expect(response.status).toBe(412);
  });

  test('should not create a new permission and return an exception for sending empty resource', async () => {
    const payload = {
      name: 'test-resource',
      description: 'test',
      response: '',
      roleId: roleExists.id,
    };
    const response = await createPermission(payload);
    expect(response.status).toBe(412);
  });

  test('should not create a new permission and return an exception for sending a invalid roleId', async () => {
    const payload = {
      name: 'test-roleId',
      description: 'test',
      resource: 'permission',
      roleId: 999999,
    };
    const response = await createPermission(payload);
    expect(response.status).toBe(404);
  });

  test('should create a new permission and return expected response for sending empty roleId', async () => {
    const payload = {
      name: 'test-roleId2',
      description: 'test',
      resource: 'permission',
    };
    const response = await createPermission(payload);
    expect(response.status).toBe(200);
  });

  test('should create a new permission and return the expected response', async () => {
    const payload = {
      name: 'test-create',
      description: 'test',
      resource: 'permission',
      roleId: roleExists.id,
    };

    const response = await createPermission(payload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', payload.name);
    expect(response.body).toHaveProperty('description', payload.description);
    expect(response.body).toHaveProperty('resource', payload.resource);
    expect(response.body).toHaveProperty('roleId', roleExists.id);
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });
});
