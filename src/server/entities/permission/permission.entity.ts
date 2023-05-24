export interface IPermission {
  id?: number;
  name: string;
  description: string | null;
  resource: string;
  roleId: number | null;
  createdAt: Date;
  updatedAt: Date;
}
