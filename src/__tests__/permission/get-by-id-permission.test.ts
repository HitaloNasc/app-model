/* eslint-disable @typescript-eslint/no-non-null-assertion */
import request from 'supertest';
import app from '../../app';
import { PrismaClient } from '@prisma/client';
import { IPermission } from '../../server/entities/permission/permission.entity';

describe('Permission API - GET BY ID /permission', () => {
  let prisma: PrismaClient;

  const createPermission = async (payload: object) => {
    return await request(app).post('/permission').send(payload);
  };

  const getByIdPermission = async (id: number) => {
    return await request(app).get(`/permission/${id}`);
  };

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  let permissionTest: IPermission;
  beforeEach(async () => {
    const response = await createPermission({
      name: 'test-permission',
      description: 'test',
      resource: 'permission',
    });

    permissionTest = response.body;
  });

  afterEach(async () => {
    await prisma.permission.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should return permission found', async () => {
    const response = await getByIdPermission(permissionTest.id!);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('roleId');
    expect(response.body).toHaveProperty('resource');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });

  test('should return permission not found', async () => {
    const response = await getByIdPermission(999999);
    expect(response.statusCode).toBe(404);
  });
});
