import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';

import type { AuthenticatedUser } from '@/modules/auth/types';

import { MESSAGES } from '@/common/constants';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles?.length) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        const user = request.user as AuthenticatedUser | undefined;

        if (!user) {
            throw new ForbiddenException(MESSAGES.AUTH.ERROR.UNAUTHORIZED);
        }

        const hasRole = requiredRoles.some((requiredRole) =>
            user.roles.some((userRole) => userRole.name === requiredRole),
        );

        if (!hasRole) {
            throw new ForbiddenException(MESSAGES.AUTH.ERROR.FORBIDDEN);
        }

        return true;
    }
}
