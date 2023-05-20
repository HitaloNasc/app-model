import { Logger } from '../../../common/lib/logger';
import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { IUser } from '../interfaces/user-entity.interface';

export class UserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: IUser) {
    Logger.log('repository - user - create');
    return await this.prisma.user.create({
      data,
    });
  }

  async getAll() {
    Logger.log('repository - user - getAll');
    return await this.prisma.user.findMany();
  }

  async getByID(id: number) {
    Logger.log('repository - user - getByID');
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getByEmail(email: string) {
    Logger.log('repository - user - getByEmail');
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async update(id: number, data: IUser) {
    Logger.log('repository - user - update');
    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async deactivate(id: number, data: IUser) {
    Logger.log('repository - user - delete');
    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async reactivate(id: number, data: IUser) {
    Logger.log('repository - user - delete');
    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }
}
