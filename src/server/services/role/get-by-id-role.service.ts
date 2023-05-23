import { Logger } from '../../../common/lib/logger';
import { Errors } from '../../../common/lib/http-exeption';
import { RoleRepository } from '../../repositories/role/role.repository';

export class GetByIdRoleService {
  private repository: RoleRepository;

  constructor() {
    this.repository = new RoleRepository();
  }

  async execute(id: number) {
    Logger.log('service - role - getByID');
    Logger.dir({ id });

    const include = {
      permissions: true,
    };

    const role = await this.repository.getByID(id, include);

    if (!role) {
      throw Errors.NOT_FOUND([{ key: 'error_404_role', data: { id } }]);
    }

    return {
      id: role.id,
      name: role.name,
      description: role.description,
      userId: role.userId,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}
