import { Logger } from '../../../common/lib/logger';
import { Errors } from '../../../common/lib/http-exeption';
import { UserRepository } from '../repository/user.repository';

export class GetByIdUserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async execute(id: number) {
    Logger.log('service - user - getByID');
    Logger.dir({ id });

    const user = await this.repository.getByID(id);

    if (!user) {
      throw Errors.NOT_FOUND([{ key: 'error_404_user', data: { id } }]);
    }

    return user;
  }
}
