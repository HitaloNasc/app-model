import { Logger } from '../../../common/lib/logger';
import { Errors } from '../../../common/lib/http-exeption';
import { PermissionRepository } from '../../repositories/permission/permission.repository';

export class GetByIdPermissionService {
  private repository: PermissionRepository;

  constructor() {
    this.repository = new PermissionRepository();
  }

  async execute(id: number) {
    Logger.log('service - permission - getByID');
    Logger.dir({ id });

    const include = {
      Role: true,
    };

    const permission = await this.repository.getByID(id, include);

    if (!permission) {
      throw Errors.NOT_FOUND([{ key: 'error_404_permission', data: { id } }]);
    }

    return {
      id: permission.id,
      name: permission.name,
      description: permission.description,
      roleId: permission.roleId,
      resource: permission.resource,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }
}
