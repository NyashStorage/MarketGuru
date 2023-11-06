import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Response } from 'express';
import { TokensService } from '../../tokens/tokens.service';

/**
 * Moves "refresh_token" from response body to cookie.
 */
@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private readonly tokensService: TokensService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        if (!data || !data['refreshToken']) return data;

        // Clear cookie if delete keyword is specified.
        if (data.refreshToken === 'invalidate') {
          this.tokensService.invalidateTokenCookie(response);
          return data;
        }

        // Transfer refresh token from response body to cookie.
        this.tokensService.prepareTokenCookie(data.refreshToken, response);
        delete data['refreshToken'];

        return data;
      }),
    );
  }
}
