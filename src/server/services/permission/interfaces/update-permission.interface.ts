export interface IUpdatePermission {
  name?: string;
  description?: string | null;
  resource?: string;
  roleId?: number | null;
}
