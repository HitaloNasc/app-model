import { IUser } from '../../../entities/user/user.entity';
import { Prisma } from '@prisma/client';

export interface IUserRepository {
  create(user: IUser): Promise<IUser>;
  getAll(include?: Prisma.UserInclude): Promise<IUser[]>;
  getByID(id: number, include?: Prisma.UserInclude): Promise<IUser | null>;
  getByEmail(email: string, include?: Prisma.UserInclude): Promise<IUser | null>;
  update(id: number, user: IUser): Promise<IUser>;
  deactivate(id: number, user: IUser): Promise<IUser>;
  reactivate(id: number, user: IUser): Promise<IUser>;
}
