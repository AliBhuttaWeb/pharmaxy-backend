import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import type { AuthenticatedUser } from '@/modules/auth/types';

import { MESSAGES } from '@/common/constants';
import { PERMISSIONS_KEY } from '@/modules/auth/decorators';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // No permission requirement
        if (!requiredPermissions?.length) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        const user = request.user as AuthenticatedUser | undefined;

        if (!user) {
            throw new ForbiddenException(MESSAGES.AUTH.ERROR.UNAUTHORIZED);
        }

        const hasPermission = requiredPermissions.every((permission) =>
            user.permissions.includes(permission),
        );

        if (!hasPermission) {
            throw new ForbiddenException(MESSAGES.AUTH.ERROR.FORBIDDEN);
        }

        return true;
    }
}
