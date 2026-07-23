import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { MESSAGES } from '@/common/constants/messages.constants';
import { IS_PUBLIC_KEY } from '@/common/decorators';
import type { AuthenticatedUser } from '@modules/auth/types';
import { JWT } from '@/modules/auth/constants/jwt.constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  override canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  override handleRequest<TUser = AuthenticatedUser>(
    err: unknown,
    user: unknown,
    info: unknown,
  ): TUser {
    const passportInfo = info as { name?: string } | undefined;

    switch (passportInfo?.name) {
      case JWT.PASSPORT_ERROR.TOKEN_EXPIRED:
        throw new UnauthorizedException(
          MESSAGES.AUTH.ERROR.ACCESS_TOKEN_EXPIRED,
        );

      case JWT.PASSPORT_ERROR.INVALID_TOKEN:
      case JWT.PASSPORT_ERROR.NOT_BEFORE:
        throw new UnauthorizedException(
          MESSAGES.AUTH.ERROR.INVALID_ACCESS_TOKEN,
        );
    }

    if (err || !user) {
      throw new UnauthorizedException(
        MESSAGES.AUTH.ERROR.AUTHENTICATION_REQUIRED,
      );
    }

    return user as TUser;
  }
}