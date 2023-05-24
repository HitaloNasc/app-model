import { Logger } from '../../../common/lib/logger';
import { Errors } from '../../../common/lib/http-exeption';
import { isEmpty } from 'lodash';
import { IPermission } from '../../entities/permission/permission.entity';
import { ICreatePermission } from './interfaces/create-permission.interface';
import { PermissionRepository } from '../../repositories/permission/permission.repository';
import { GetByIdRoleService } from '../role/get-by-id-role.service';

export class CreatePermissionService {
  private repository: PermissionRepository;

  constructor() {
    this.repository = new PermissionRepository();
  }

  private async validate(permission: ICreatePermission): Promise<void> {
    if (isEmpty(permission)) {
      throw Errors.PRECONDITION_FAILED([{ key: 'permission__empty_data', data: {} }]);
    }

    const obrigatory = ['name', 'resource'] as const;
    obrigatory.forEach((param) => {
      if (isEmpty(permission[param])) {
        throw Errors.PRECONDITION_FAILED([{ key: 'permission__param_obrigatory_is_missing', data: { param } }]);
      }
    });

    const existsName = await this.repository.getByName(permission.name);
    if (existsName) {
      throw Errors.PRECONDITION_FAILED([{ key: 'permission__name_already_exists', data: { name: permission.name } }]);
    }

    if (permission.roleId) {
      const getByIdRoleService = new GetByIdRoleService();
      await getByIdRoleService.execute(permission.roleId);
    }
  }

  private async format(permission: ICreatePermission): Promise<IPermission> {
    return {
      name: permission.name,
      description: permission.description,
      roleId: permission.roleId,
      resource: permission.resource,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    };
  }

  async execute(permission: ICreatePermission) {
    Logger.log('service - permission - create');
    Logger.dir({ permission });

    await this.validate(permission);

    const data = await this.format(permission);

    const permissionCreated = await this.repository.create(data);

    return {
      id: permissionCreated.id,
      name: permissionCreated.name,
      description: permissionCreated.description,
      roleId: permissionCreated.roleId,
      resource: permissionCreated.resource,
      createdAt: permissionCreated.createdAt,
      updatedAt: permissionCreated.updatedAt,
    };
  }
}
