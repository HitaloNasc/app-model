import { Logger } from '../../../common/lib/logger';
import { PermissionRepository } from '../../repositories/permission/permission.repository';

export class GetAllPermissionService {
  private repository: PermissionRepository;

  constructor() {
    this.repository = new PermissionRepository();
  }

  async execute() {
    Logger.log('service - permission - getByID');

    const permissions = await this.repository.getAll();

    const permissionsFormated = permissions.map((permission) => {
      return {
        id: permission.id,
        name: permission.name,
        description: permission.description,
        roleId: permission.roleId,
        resource: permission.resource,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
      };
    });

    return permissionsFormated;
  }
}
