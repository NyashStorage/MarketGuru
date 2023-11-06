import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TokensService } from '../../tokens/tokens.service';
import { TokensResponse } from '../../tokens/dao/responses/token.response';

/**
 * Automatically refresh tokens without interrupting request if possible.
 */
@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(private readonly tokensService: TokensService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return next();

    // Trim word "Bearer".
    const access_token = authHeader.slice(7);

    // Check validity of access token.
    try {
      request.user = this.tokensService.verifyToken(access_token);
      // If token is valid - skip request further.
      return next();
    } catch (_) {}

    // Refresh tokens by refresh token from cookie.
    let updatedTokens: TokensResponse;
    try {
      const refreshToken = request.cookies
        ? request.cookies['refreshToken']
        : undefined;

      updatedTokens = this.tokensService.refreshToken(refreshToken);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }

    // Set new tokens in current requests for further execution.
    request.user = this.tokensService.verifyToken(updatedTokens.accessToken);
    request.headers.authorization = `Bearer ${updatedTokens.accessToken}`;

    // Send new tokens to user.
    this.tokensService.prepareTokenCookie(updatedTokens.refreshToken, response);
    response.setHeader('X-Access-Token', updatedTokens.accessToken);
    next();
  }
}
