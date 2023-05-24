/* eslint-disable @typescript-eslint/no-non-null-assertion */
import request from 'supertest';
import app from '../../app';
import { PrismaClient } from '@prisma/client';
import { IRole } from '../../server/entities/role/role.entity';

describe('Role API - PUT UPDATE /role', () => {
  let prisma: PrismaClient;

  const createRole = async (payload: object) => {
    return await request(app).post('/role').send(payload);
  };

  const updateRole = async (id: number, payload: object) => {
    return await request(app).put(`/role/${id}`).send(payload);
  };

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  let roleTest1: IRole;
  let roleTest2: IRole;
  beforeEach(async () => {
    const [response1, response2] = await Promise.all([
      createRole({
        name: 'test-1',
        description: 'test',
      }),
      createRole({
        name: 'test-2',
        description: 'test',
      }),
    ]);

    roleTest1 = response1.body;
    roleTest2 = response2.body;
  });

  afterEach(async () => {
    await prisma.role.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should not update a non-existent role', async () => {
    const response = await updateRole(999999, {});
    expect(response.status).toBe(404);
  });

  test('should not update a role with a existent name', async () => {
    const response = await updateRole(roleTest2.id!, {
      name: roleTest1.name,
    });
    expect(response.status).toBe(412);
  });

  test('should not update a role with a empty name', async () => {
    const response = await updateRole(roleTest1.id!, {
      name: '',
    });
    expect(response.status).toBe(412);
  });

  test('should not update a role and return an exception for sending a invalid userId', async () => {
    const payload = {
      name: 'test-userId',
      description: 'test',
      userId: 999999,
    };
    const response = await updateRole(roleTest1.id!, payload);
    expect(response.status).toBe(404);
  });

  test('should update a role and return the expected response', async () => {
    const payload = {
      name: 'test-update-role',
      description: 'test',
    };

    const response = await updateRole(roleTest1.id!, payload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', payload.name);
    expect(response.body).toHaveProperty('description', payload.description);
    expect(response.body).toHaveProperty('userId');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });
});
