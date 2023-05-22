import { Logger } from '../../../common/lib/logger';
import { Errors } from '../../../common/lib/http-exeption';
import { IUser } from '../../entities/user/user.entity';
import { UserRepository } from '../../repositories/user/user.repository';
import { STATUS } from './consts/user-status.consts';

export class ReactivateUserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  private async validate(id: number): Promise<void> {
    const existsUser = await this.repository.getByID(id);
    if (!existsUser) {
      throw Errors.NOT_FOUND([{ key: 'error_404_user', data: { id } }]);
    }

    if (existsUser.status === STATUS.ACTIVE) {
      throw Errors.PRECONDITION_FAILED([{ key: 'user__already_active', data: { id } }]);
    }
  }

  private async format(id: number): Promise<IUser | undefined> {
    const cUser = await this.repository.getByID(id);

    if (!cUser) {
      return;
    }

    return {
      ...cUser,
      status: STATUS.ACTIVE,
      updatedAt: new Date(Date.now()),
    };
  }

  async execute(id: number) {
    Logger.log('service - user - reactivate');
    Logger.dir({ id });

    await this.validate(id);

    const data = await this.format(id);

    if (!data) {
      return;
    }

    const userReactivated = await this.repository.reactivate(id, data);

    return {
      id: userReactivated.id,
      name: userReactivated.name,
      email: userReactivated.email,
      status: userReactivated.status,
      createdAt: userReactivated.createdAt,
      updatedAt: userReactivated.updatedAt,
    };
  }
}
