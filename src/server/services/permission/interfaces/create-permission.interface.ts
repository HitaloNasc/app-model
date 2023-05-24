export interface ICreatePermission {
  name: string;
  description: string | null;
  resource: string;
  roleId: number | null;
}
