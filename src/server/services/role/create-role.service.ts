import { Logger } from '../../../common/lib/logger';
import { Errors } from '../../../common/lib/http-exeption';
import { isEmpty } from 'lodash';
import { IRole } from '../../entities/role/role.entity';
import { ICreateRole } from './interfaces/create-role.interface';
import { RoleRepository } from '../../repositories/role/role.repository';
import { GetByIdUserService } from '../user/get-by-id-user.service';

export class CreateRoleService {
  private repository: RoleRepository;

  constructor() {
    this.repository = new RoleRepository();
  }

  private async validate(role: ICreateRole): Promise<void> {
    if (isEmpty(role)) {
      throw Errors.PRECONDITION_FAILED([{ key: 'role__empty_data', data: {} }]);
    }

    const obrigatory = ['name'] as const;
    obrigatory.forEach((param) => {
      if (isEmpty(role[param])) {
        throw Errors.PRECONDITION_FAILED([{ key: 'role__param_obrigatory_is_missing', data: { param } }]);
      }
    });

    const existsName = await this.repository.getByName(role.name);
    if (existsName) {
      throw Errors.PRECONDITION_FAILED([{ key: 'role__name_already_exists', data: { name: role.name } }]);
    }

    if (role.userId) {
      const getByIdUserService = new GetByIdUserService();
      await getByIdUserService.execute(role.userId);
    }
  }

  private async format(role: ICreateRole): Promise<IRole> {
    return {
      name: role.name,
      description: role.description,
      userId: role.userId,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    };
  }

  async execute(role: ICreateRole) {
    Logger.log('service - role - create');
    Logger.dir({ role });

    await this.validate(role);

    const data = await this.format(role);

    const roleCreated = await this.repository.create(data);

    return {
      id: roleCreated.id,
      name: roleCreated.name,
      description: roleCreated.description,
      userId: roleCreated.userId,
      createdAt: roleCreated.createdAt,
      updatedAt: roleCreated.updatedAt,
    };
  }
}
