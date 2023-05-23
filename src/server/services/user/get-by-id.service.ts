import { Logger } from '../../../common/lib/logger';
import { Errors } from '../../../common/lib/http-exeption';
import { UserRepository } from '../../repositories/user/user.repository';

export class GetByIdUserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async execute(id: number) {
    Logger.log('service - user - getByID');
    Logger.dir({ id });

    const include = {
      Group: true,
      // roles: true,
      // AuthToken: true,
      // ActivityLog: true,
    };

    const user = await this.repository.getByID(id, include);

    if (!user) {
      throw Errors.NOT_FOUND([{ key: 'error_404_user', data: { id } }]);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      groupId: user.groupId,
      // roles: user.roles,
      // authToken: user.authToken,
      // activityLog: user.activityLog,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
