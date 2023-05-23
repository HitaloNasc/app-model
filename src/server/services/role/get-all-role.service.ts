import { Logger } from '../../../common/lib/logger';
import { RoleRepository } from '../../repositories/role/role.repository';

export class GetAllRoleService {
  private repository: RoleRepository;

  constructor() {
    this.repository = new RoleRepository();
  }

  async execute() {
    Logger.log('service - role - getByID');

    const roles = await this.repository.getAll();

    const rolesFormated = roles.map((role) => {
      return {
        id: role.id,
        name: role.name,
        description: role.description,
        userId: role.userId,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      };
    });

    return rolesFormated;
  }
}
