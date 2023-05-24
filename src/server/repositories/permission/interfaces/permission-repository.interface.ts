import { IPermission } from '../../../entities/permission/permission.entity';
import { Prisma } from '@prisma/client';

export interface IPermissionRepository {
  create(user: IPermission): Promise<IPermission>;
  getAll(include?: Prisma.PermissionInclude): Promise<IPermission[]>;
  getByID(id: number, include?: Prisma.PermissionInclude): Promise<IPermission | null>;
  getByName(name: string, include?: Prisma.PermissionInclude): Promise<IPermission | null>;
  update(id: number, user: IPermission): Promise<IPermission>;
}
