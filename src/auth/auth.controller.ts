import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpRequest } from './dao/requests/sign-up.request';
import { SignInRequest } from './dao/requests/sign-in.request';
import { TokenInterceptor } from './interceptors/token.interceptor';
import {
  TokenResponse,
  TokensResponse,
} from '../tokens/dao/responses/token.response';
import { castToEntity } from '../utils/helpers/type.helpers';
import { ErrorResponse } from '../app/dao/responses/error.response';
import { LogoutResponse } from './dao/responses/logout.response';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(TokenInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Registers user' })
  @ApiBody({ type: SignUpRequest })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success.',
    type: TokenResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error.',
    type: ErrorResponse,
  })
  async signUp(@Body() signUpRequest: SignUpRequest): Promise<TokensResponse> {
    return castToEntity(this.authService.signUp(signUpRequest), TokensResponse);
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Authorizes user' })
  @ApiBody({ type: SignInRequest })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success.',
    type: TokenResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authorization error.',
    type: ErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error.',
    type: ErrorResponse,
  })
  async signIn(@Body() signInRequest: SignInRequest): Promise<TokensResponse> {
    return castToEntity(this.authService.signIn(signInRequest), TokensResponse);
  }

  @Delete()
  @ApiOperation({ summary: "Clears user's cookie" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success.',
    type: LogoutResponse,
  })
  async logout(): Promise<LogoutResponse> {
    return { refreshToken: 'invalidate', success: true };
  }
}
