import { Logger } from '../../../common/lib/logger';
import { PrismaClient } from '@prisma/client';
import { IRoleRepository } from './interfaces/role-repository.interface';
import { IRole } from '../../entities/role/role.entity';
import { Prisma } from '@prisma/client';

export class RoleRepository implements IRoleRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: IRole) {
    Logger.log('repository - role - create');
    return await this.prisma.role.create({
      data,
    });
  }

  async getAll(include?: Prisma.RoleInclude) {
    Logger.log('repository - role - getAll');
    return await this.prisma.role.findMany({ include });
  }

  async getByID(id: number, include?: Prisma.RoleInclude) {
    Logger.log('repository - role - getByID');
    return await this.prisma.role.findUnique({
      where: {
        id,
      },
      include,
    });
  }

  async getByName(name: string, include?: Prisma.RoleInclude) {
    Logger.log('repository - role - getByName');
    return await this.prisma.role.findUnique({
      where: {
        name,
      },
      include,
    });
  }

  async update(id: number, data: IRole) {
    Logger.log('repository - role - update');
    return await this.prisma.role.update({
      where: {
        id,
      },
      data,
    });
  }
}
