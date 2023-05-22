export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}
