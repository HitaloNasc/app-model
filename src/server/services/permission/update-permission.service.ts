import { Logger } from '../../../common/lib/logger';
import { Errors } from '../../../common/lib/http-exeption';
import { IUpdatePermission } from './interfaces/update-permission.interface';
import { IPermission } from '../../entities/permission/permission.entity';
import { PermissionRepository } from '../../repositories/permission/permission.repository';
import { GetByIdRoleService } from '../role/get-by-id-role.service';

export class UpdatePermissionService {
  private repository: PermissionRepository;

  constructor() {
    this.repository = new PermissionRepository();
  }

  private async validate(id: number, permission: IUpdatePermission): Promise<void> {
    const existsPermission = await this.repository.getByID(id);
    if (!existsPermission) {
      throw Errors.NOT_FOUND([{ key: 'error_404_permission', data: { id } }]);
    }

    if (Object.prototype.hasOwnProperty.call(permission, 'name')) {
      if (permission.name === undefined || permission.name.trim().length === 0) {
        throw Errors.PRECONDITION_FAILED([{ key: 'permission__name_is_not_valid', data: { name: permission.name } }]);
      }

      const existsName = await this.repository.getByName(permission.name);
      if (existsName && existsName.id !== id) {
        throw Errors.PRECONDITION_FAILED([{ key: 'permission__there_is_already_a_permission_with_this_name', data: { name: permission.name } }]);
      }
    }

    if (Object.prototype.hasOwnProperty.call(permission, 'resource')) {
      if (permission.resource === undefined || permission.resource.trim().length === 0) {
        throw Errors.PRECONDITION_FAILED([{ key: 'permission__resource_is_not_valid', data: { resource: permission.resource } }]);
      }
    }

    if (permission.roleId) {
      const getByIdRoleService = new GetByIdRoleService();
      await getByIdRoleService.execute(permission.roleId);
    }
  }

  private async format(id: number, permission: IUpdatePermission): Promise<IPermission | undefined> {
    const cPermission = await this.repository.getByID(id);

    if (!cPermission) {
      return;
    }

    return {
      name: permission.name ?? cPermission.name ?? '',
      description: permission.description ?? cPermission.description,
      roleId: permission.roleId ?? cPermission.roleId,
      resource: permission.resource ?? cPermission.resource,
      createdAt: cPermission.createdAt,
      updatedAt: new Date(Date.now()),
    };
  }

  async execute(id: number, permission: IUpdatePermission) {
    Logger.log('service - permission - update');
    Logger.dir({ permission });

    await this.validate(id, permission);

    const data = await this.format(id, permission);

    if (!data) {
      return;
    }

    const permissionUpdated = await this.repository.update(id, data);

    return {
      id: permissionUpdated.id,
      name: permissionUpdated.name,
      description: permissionUpdated.description,
      roleId: permissionUpdated.roleId,
      resource: permissionUpdated.resource,
      createdAt: permissionUpdated.createdAt,
      updatedAt: permissionUpdated.updatedAt,
    };
  }
}
