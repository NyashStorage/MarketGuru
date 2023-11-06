import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

/**
 * Adds a header to disable caching if a new token is present in response.
 */
@Injectable()
export class DisableCacheMiddleware implements NestMiddleware {
  use(_: Request, res: Response, next: NextFunction) {
    if (res.hasHeader('x-access-token'))
      res.setHeader('Cache-Control', 'no-store');

    next();
  }
}
