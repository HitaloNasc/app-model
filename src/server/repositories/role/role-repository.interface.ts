import { IRole } from '../../entities/role/role.entity';
import { Prisma } from '@prisma/client';

export interface IRoleRepository {
  create(user: IRole): Promise<IRole>;
  getAll(include?: Prisma.RoleInclude): Promise<IRole[]>;
  getByID(id: number, include?: Prisma.RoleInclude): Promise<IRole | null>;
  getByName(name: string, include?: Prisma.RoleInclude): Promise<IRole | null>;
  update(id: number, user: IRole): Promise<IRole>;
}
