import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WhereOptions } from 'sequelize';
import * as bcrypt from 'bcrypt';
import { User } from './models/user.model';
import { CreateUserRequest } from './dao/requests/create-user.request';
import { ListResponse } from '../app/dao/responses/list.response';
import { UpdateUserRequest } from './dao/requests/update-user.request';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  /**
   * @throws BadRequestException When account with same email already registered.
   * @throws BadRequestException When account with same phone number already registered.
   */
  async create(data: CreateUserRequest): Promise<User> {
    let user: User;

    try {
      user = await this.findByEmail(data.email);
    } catch (_) {}

    if (user)
      throw new BadRequestException(
        `An account with email "${data.email}" already registered.`,
      );

    try {
      user = await this.findByPhone(data.phone);
    } catch (_) {}

    if (user)
      throw new BadRequestException(
        `An account with phone number "${data.phone}" already registered.`,
      );

    return this.userModel.create({
      ...data,
      password: await bcrypt.hash(data.password, 12),
    });
  }

  /**
   * @throws NotFoundException When account with such credentials was not found.
   */
  async findOne(query: WhereOptions<User>) {
    const user = await this.userModel.findOne({ where: query });
    if (!user)
      throw new NotFoundException(
        'An account with such credentials was not found.',
      );

    return user;
  }

  /**
   * @throws NotFoundException When account with such id was not found.
   */
  async findByID(id: User['id']): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException(`User with id "${id}" not found.`);

    return user;
  }

  /**
   * @throws NotFoundException When account with such email was not found.
   */
  findByEmail(email: User['email']): Promise<User> {
    return this.findOne({ email });
  }

  /**
   * @throws NotFoundException When account with such phone number was not found.
   */
  findByPhone(phone: User['phone']): Promise<User> {
    return this.findOne({ phone });
  }

  async findAll(
    query: WhereOptions<User> = {},
    page = 1,
    itemsPerPage = 20,
  ): Promise<ListResponse<User>> {
    const users = await this.userModel.findAll({
      where: query,
      offset: (page - 1) * itemsPerPage,
      limit: itemsPerPage,
    });

    const count = await this.userModel.count({ where: query });

    return {
      data: users,
      pagination: {
        page: page,
        perPage: itemsPerPage,
        total: count,
        totalPages: Math.ceil(count / itemsPerPage),
      },
    };
  }

  /**
   * @throws NotFoundException When account with such id was not found.
   * @throws BadRequestException When account with same email already registered.
   * @throws BadRequestException When account with same phone number already registered.
   */
  async update(id: User['id'], data: UpdateUserRequest): Promise<User> {
    const user = await this.findByID(id);
    if (!user) throw new NotFoundException(`User with id "${id}" not found.`);

    let registeredUser: User;

    if (data.email) {
      try {
        registeredUser = await this.findByEmail(data.email);
      } catch (_) {}

      if (registeredUser)
        throw new ForbiddenException(
          `An account with email "${data.email}" already registered.`,
        );
    }

    if (data.phone) {
      try {
        registeredUser = await this.findByPhone(data.phone);
      } catch (_) {}

      if (registeredUser)
        throw new ForbiddenException(
          `An account with phone number "${data.phone}" already registered.`,
        );
    }

    Object.assign(user, data);
    if (data.password) user.password = await bcrypt.hash(data.password, 12);

    return user.save();
  }

  /**
   * @throws NotFoundException When account with such id was not found.
   */
  async delete(id: User['id']): Promise<User> {
    const user = await this.findByID(id);
    if (!user) throw new NotFoundException(`User with id "${id}" not found.`);

    await user.destroy();
    return user;
  }
}
