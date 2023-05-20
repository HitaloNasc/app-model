import { Logger } from '../../../common/lib/logger';
import { UserRepository } from '../repository/user.repository';

export class GetAllUserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async execute() {
    Logger.log('service - user - getByID');
    return await this.repository.getAll();
  }
}
