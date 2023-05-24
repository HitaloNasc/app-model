import { Logger } from '../../../common/lib/logger';
import { Errors } from '../../../common/lib/http-exeption';
import { IUpdateRole } from './interfaces/update-role.interface';
import { IRole } from '../../entities/role/role.entity';
import { RoleRepository } from '../../repositories/role/role.repository';
import { GetByIdUserService } from '../user/get-by-id-user.service';

export class UpdateRoleService {
  private repository: RoleRepository;

  constructor() {
    this.repository = new RoleRepository();
  }

  private async validate(id: number, role: IUpdateRole): Promise<void> {
    const existsRole = await this.repository.getByID(id);
    if (!existsRole) {
      throw Errors.NOT_FOUND([{ key: 'error_404_role', data: { id } }]);
    }

    if (Object.prototype.hasOwnProperty.call(role, 'name')) {
      if (role.name === undefined || role.name.trim().length === 0) {
        throw Errors.PRECONDITION_FAILED([{ key: 'role__name_is_not_valid', data: { name: role.name } }]);
      }

      const existsName = await this.repository.getByName(role.name);
      if (existsName && existsName.id !== id) {
        throw Errors.PRECONDITION_FAILED([{ key: 'role__there_is_already_a_role_with_this_name', data: { name: role.name } }]);
      }
    }

    if (role.userId) {
      const getByIdUserService = new GetByIdUserService();
      await getByIdUserService.execute(role.userId);
    }
  }

  private async format(id: number, role: IUpdateRole): Promise<IRole | undefined> {
    const cRole = await this.repository.getByID(id);

    if (!cRole) {
      return;
    }

    return {
      name: role.name ?? cRole.name ?? '',
      description: role.description ?? cRole.description,
      userId: role.userId ?? cRole.userId,
      createdAt: cRole.createdAt,
      updatedAt: new Date(Date.now()),
    };
  }

  async execute(id: number, role: IUpdateRole) {
    Logger.log('service - role - update');
    Logger.dir({ role });

    await this.validate(id, role);

    const data = await this.format(id, role);

    if (!data) {
      return;
    }

    const roleUpdated = await this.repository.update(id, data);

    return {
      id: roleUpdated.id,
      name: roleUpdated.name,
      description: roleUpdated.description,
      userId: roleUpdated.userId,
      createdAt: roleUpdated.createdAt,
      updatedAt: roleUpdated.updatedAt,
    };
  }
}
