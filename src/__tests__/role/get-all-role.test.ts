import request from 'supertest';
import app from '../../app';
import { PrismaClient } from '@prisma/client';

describe('Role API - GET ALL /role', () => {
  let prisma: PrismaClient;

  const createRole = async (payload: object) => {
    return await request(app).post('/role').send(payload);
  };

  const getAll = async () => {
    return await request(app).get('/role');
  };

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  beforeEach(async () => {
    await Promise.all([
      createRole({
        name: 'test-role-1',
        description: 'test',
      }),
      createRole({
        name: 'test-role-2',
        description: 'test',
      }),
    ]);
  });

  afterEach(async () => {
    await prisma.role.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should return roles found', async () => {
    const response = await getAll();

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });
});
