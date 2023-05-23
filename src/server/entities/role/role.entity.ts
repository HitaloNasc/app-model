export interface IRole {
  id?: number;
  name: string;
  description: string | null;
  userId: number | null;
  createdAt: Date;
  updatedAt: Date;
}
