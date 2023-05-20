import { Logger } from '../../../common/lib/logger';
import { Errors } from '../../../common/lib/http-exeption';
import { STATUS } from '../consts/user-status.consts';
import { IUser } from '../interfaces/user-entity.interface';
import { UserRepository } from '../repository/user.repository';

export class DeactivateUserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  private async validate(id: number): Promise<void> {
    const existsUser = await this.repository.getByID(id);
    if (!existsUser) {
      throw Errors.NOT_FOUND([{ key: 'error_404_user', data: { id } }]);
    }

    if (existsUser.status === STATUS.INACTIVE) {
      throw Errors.PRECONDITION_FAILED([{ key: 'user__already_inactive', data: { id } }]);
    }
  }

  private async format(id: number): Promise<IUser | undefined> {
    const cUser = await this.repository.getByID(id);

    if (!cUser) {
      return;
    }

    return {
      ...cUser,
      status: STATUS.INACTIVE,
      updatedAt: new Date(Date.now()),
    };
  }

  async execute(id: number) {
    Logger.log('service - user - deactivate');
    Logger.dir({ id });

    await this.validate(id);

    const data = await this.format(id);

    if (!data) {
      return;
    }

    return await this.repository.deactivate(id, data);
  }
}
