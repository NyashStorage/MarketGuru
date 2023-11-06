import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

interface CurrentUserDecoratorParam {
  requireUser: boolean;
}

/**
 * Gets current user from request or throws an error if no user is found.
 */
export const CurrentUser = createParamDecorator(
  (
    data: CurrentUserDecoratorParam = { requireUser: true },
    ctx: ExecutionContext,
  ) => {
    const { user } = ctx.switchToHttp().getRequest();
    if (!user && data.requireUser) throw new BadRequestException();

    return user;
  },
);
