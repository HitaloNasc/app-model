import { Logger } from '../../../common/lib/logger';
import { Errors } from '../../../common/lib/http-exeption';
import { IUser } from '../../entities/user/user.entity';
import { IUpdateUser } from './interfaces/update-user.interface';
import { UserRepository } from '../../repositories/user/user.repository';
import { STATUS } from './consts/user-status.consts';
import { hashPassword } from '../../../common/lib/hash-password';
import { validateEmail } from '../../../common/lib/validate-email';
import { validatePasswordStrength } from '../../../common/lib/validate-password-strength';

export class UpdateUserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  private async validate(id: number, user: IUpdateUser): Promise<void> {
    const existsUser = await this.repository.getByID(id);
    if (!existsUser) {
      throw Errors.NOT_FOUND([{ key: 'error_404_user', data: { id } }]);
    }

    if (user.email) {
      const isValidEmail = validateEmail(user.email);
      if (!isValidEmail) {
        throw Errors.PRECONDITION_FAILED([{ key: 'user__email_is_not_valid', data: { email: user.email } }]);
      }

      const existsEmail = await this.repository.getByEmail(user.email);
      if (existsEmail && existsEmail.id !== id) {
        throw Errors.PRECONDITION_FAILED([{ key: 'user__there_is_already_a_user_with_this_email', data: { email: user.email } }]);
      }
    }

    if (user.password) {
      const isStrengthPassowrd = validatePasswordStrength(user.password);
      if (!isStrengthPassowrd) {
        throw Errors.PRECONDITION_FAILED([{ key: 'user__password_is_not_strong', data: { password: user.password } }]);
      }
    }
  }

  private async formatUpdate(id: number, user: IUpdateUser): Promise<IUser | undefined> {
    const cUser = await this.repository.getByID(id);

    if (!cUser) {
      return;
    }

    const password = user.password ? await hashPassword(user.password) : null;

    return {
      name: user.name ?? cUser.name ?? '',
      email: user.email ?? cUser.email,
      password: password ?? cUser.password,
      status: STATUS.ACTIVE,
      createdAt: cUser.createdAt,
      updatedAt: new Date(Date.now()),
    };
  }

  async execute(id: number, user: IUpdateUser) {
    Logger.log('service - user - update');
    Logger.dir({ user });

    await this.validate(id, user);

    const data = await this.formatUpdate(id, user);

    if (!data) {
      return;
    }

    const userUpdated = await this.repository.update(id, data);

    return {
      id: userUpdated.id,
      name: userUpdated.name,
      email: userUpdated.email,
      status: userUpdated.status,
      createdAt: userUpdated.createdAt,
      updatedAt: userUpdated.updatedAt,
    };
  }
}
