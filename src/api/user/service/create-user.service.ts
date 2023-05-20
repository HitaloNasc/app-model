import { Logger } from '../../../common/lib/logger';
import { Errors } from '../../../common/lib/http-exeption';
import { isEmpty } from 'lodash';
import { IUser } from '../interfaces/user-entity.interface';
import { ICreateUser } from '../interfaces/create-user.interface';
import { UserRepository } from '../repository/user.repository';
import { STATUS } from '../consts/user-status.consts';
import { validateEmail } from '../../../common/lib/validate-email';
import { validatePasswordStrength } from '../../../common/lib/validate-password-strength';
import { hashPassword } from '../../../common/lib/hash-password';

export class CreateUserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  private async validate(user: ICreateUser): Promise<void> {
    if (isEmpty(user)) {
      throw Errors.PRECONDITION_FAILED([{ key: 'user__empty_data', data: {} }]);
    }

    const obrigatory = ['name', 'email', 'password'] as const;
    obrigatory.forEach((param) => {
      if (isEmpty(user[param])) {
        throw Errors.PRECONDITION_FAILED([{ key: 'user__param_obrigatory_is_missing', data: { param } }]);
      }
    });

    const isValidEmail = validateEmail(user.email);
    if (!isValidEmail) {
      throw Errors.PRECONDITION_FAILED([{ key: 'user__email_is_not_valid', data: { email: user.email } }]);
    }

    const existsEmail = await this.repository.getByEmail(user.email);
    if (existsEmail) {
      throw Errors.PRECONDITION_FAILED([{ key: 'user__there_is_already_a_user_with_this_email', data: { email: user.email } }]);
    }

    const isStrengthPassowrd = validatePasswordStrength(user.password);
    if (!isStrengthPassowrd) {
      throw Errors.PRECONDITION_FAILED([{ key: 'user__password_is_not_strong', data: { password: user.password } }]);
    }
  }

  private async format(user: ICreateUser): Promise<IUser> {
    const password = await hashPassword(user.password);

    return {
      name: user.name,
      email: user.email,
      password,
      status: STATUS.ACTIVE,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    };
  }

  async execute(user: ICreateUser) {
    Logger.log('service - user - create');
    Logger.dir({ user });

    await this.validate(user);

    const data = await this.format(user);

    return await this.repository.create(data);
  }
}
