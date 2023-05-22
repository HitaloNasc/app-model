import { Logger } from '../../../common/lib/logger';
import { UserRepository } from '../../repositories/user/user.repository';

export class GetAllUserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async execute() {
    Logger.log('service - user - getByID');

    const users = await this.repository.getAll();

    const usersFormated = users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });

    return usersFormated;
  }
}
