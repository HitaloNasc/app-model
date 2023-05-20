import { IUser } from './user-entity.interface';

export interface IUserRepository {
  create(user: IUser): Promise<IUser>;
  getAll(): Promise<IUser[]>;
  getByID(id: number): Promise<IUser | null>;
  getByEmail(email: string): Promise<IUser | null>;
  update(id: number, user: IUser): Promise<IUser>;
  deactivate(id: number, user: IUser): Promise<IUser>;
  reactivate(id: number, user: IUser): Promise<IUser>;
}
