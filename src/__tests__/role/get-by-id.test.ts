/* eslint-disable @typescript-eslint/no-non-null-assertion */
import request from 'supertest';
import app from '../../app';
import { PrismaClient } from '@prisma/client';
import { IRole } from '../../server/entities/role/role.entity';

describe('Role API - GET BY ID /role', () => {
  let prisma: PrismaClient;

  const createRole = async (payload: object) => {
    return await request(app).post('/role').send(payload);
  };

  const getById = async (id: number) => {
    return await request(app).get(`/role/${id}`);
  };

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  let roleTest: IRole;
  beforeEach(async () => {
    const response = await createRole({
      name: 'test-role',
      description: 'test',
    });

    roleTest = response.body;
  });

  afterEach(async () => {
    await prisma.role.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should return role found', async () => {
    const response = await getById(roleTest.id!);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('userId');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });

  test('should return role not found', async () => {
    const response = await getById(999999);
    expect(response.statusCode).toBe(404);
  });
});
