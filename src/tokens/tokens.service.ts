import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { TokensResponse } from './dao/responses/token.response';
import { JwtPayloadDto } from './dao/jwt-payload.dto';

@Injectable()
export class TokensService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generates access and refresh tokens with payload content inside.
   */
  public generateTokens(payload: JwtPayloadDto): TokensResponse {
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '15m',
      }),

      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }

  /**
   * Generates new access and refresh tokens if refresh token is correct.
   * @throws UnauthorizedException When refresh token not specified.
   * @throws UnauthorizedException When refresh token is invalid.
   */
  public refreshToken(
    refreshToken: TokensResponse['refreshToken'],
  ): TokensResponse {
    if (!refreshToken)
      throw new UnauthorizedException(
        'Refresh token not specified, log in to your account.',
      );

    let decodedData: JwtPayloadDto;
    try {
      decodedData = this.verifyToken(refreshToken);
    } catch (error) {
      throw new UnauthorizedException(
        'Refresh token is invalid, re-authorize your account.',
      );
    }

    return this.generateTokens(decodedData);
  }

  /**
   * Gets payload data from token.
   */
  public verifyToken(token: string): JwtPayloadDto | any {
    const payload = this.jwtService.verify(token);

    delete payload['iat'];
    delete payload['exp'];

    return payload;
  }

  /**
   * Adds cookie with refresh token to response.
   */
  public prepareTokenCookie(
    refreshToken: TokensResponse['refreshToken'],
    response: Response,
  ): void {
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  /**
   * Adds expired cookie with invalid refresh token to response.
   */
  public invalidateTokenCookie(response: Response): void {
    response.cookie('refreshToken', 'invalid', { expires: new Date(0) });
  }
}
