import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignUpRequest } from './dao/requests/sign-up.request';
import { SignInRequest } from './dao/requests/sign-in.request';
import { TokensService } from '../tokens/tokens.service';
import { TokensResponse } from '../tokens/dao/responses/token.response';
import { User } from '../users/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  /**
   * @throws BadRequestException When account with same email already registered.
   * @throws BadRequestException When account with same phone number already registered.
   */
  async signUp(signUpRequest: SignUpRequest): Promise<TokensResponse> {
    const { id: userId } = await this.usersService.create(signUpRequest);

    return this.tokensService.generateTokens({ userId });
  }

  /**
   * @throws NotFoundException When account with such email was not found.
   * @throws NotFoundException When account with such phone number was not found.
   * @throws UnauthorizedException When authentication information is incorrect.
   */
  async signIn({
    email,
    phone,
    password,
  }: SignInRequest): Promise<TokensResponse> {
    let user: User;

    if (email) user = await this.usersService.findByEmail(email);
    if (phone) user = await this.usersService.findByPhone(phone);

    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException(
        'Your authentication information is incorrect, please try again.',
      );

    return this.tokensService.generateTokens({ userId: user.id });
  }
}
