import { Logger } from '../../../common/lib/logger';
import { PrismaClient } from '@prisma/client';
import { IPermissionRepository } from './interfaces/permission-repository.interface';
import { IPermission } from '../../entities/permission/permission.entity';
import { Prisma } from '@prisma/client';

export class PermissionRepository implements IPermissionRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: IPermission) {
    Logger.log('repository - permission - create');
    return await this.prisma.permission.create({
      data,
    });
  }

  async getAll(include?: Prisma.PermissionInclude) {
    Logger.log('repository - permission - getAll');
    return await this.prisma.permission.findMany({ include });
  }

  async getByID(id: number, include?: Prisma.PermissionInclude) {
    Logger.log('repository - permission - getByID');
    return await this.prisma.permission.findUnique({
      where: {
        id,
      },
      include,
    });
  }

  async getByName(name: string, include?: Prisma.PermissionInclude) {
    Logger.log('repository - permission - getByName');
    return await this.prisma.permission.findUnique({
      where: {
        name,
      },
      include,
    });
  }

  async update(id: number, data: IPermission) {
    Logger.log('repository - permission - update');
    return await this.prisma.permission.update({
      where: {
        id,
      },
      data,
    });
  }
}
