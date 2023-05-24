import request from 'supertest';
import app from '../../app';
import { PrismaClient } from '@prisma/client';

describe('Permission API - GET ALL /permission', () => {
  let prisma: PrismaClient;

  const createPermission = async (payload: object) => {
    return await request(app).post('/permission').send(payload);
  };

  const getAllPermission = async () => {
    return await request(app).get('/permission');
  };

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  beforeEach(async () => {
    await Promise.all([
      createPermission({
        name: 'test-permission-1',
        description: 'test',
        resource: 'permission',
      }),
      createPermission({
        name: 'test-permission-2',
        description: 'test',
        resource: 'permission',
      }),
    ]);
  });

  afterEach(async () => {
    await prisma.permission.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should return permissions found', async () => {
    const response = await getAllPermission();

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });
});
