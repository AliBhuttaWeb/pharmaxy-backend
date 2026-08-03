import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import type { AuthenticatedUser } from '@/modules/auth/types';

import { MESSAGES } from '@/common/constants';
import { IS_PUBLIC_KEY, PERMISSIONS_KEY } from '../decorators';
import { PermissionResolverService } from '@/modules/permissions/services/permissions-resolver.service';
// import { PermissionResolverService } from '@/modules/permissions/services';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly permissionResolver: PermissionResolverService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        /**
         * Skip authorization for public endpoints.
         */
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        /**
         * Permissions required by the endpoint.
         */
        const requiredPermissions =
            this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
                context.getHandler(),
                context.getClass(),
            ]) ?? [];

        /**
         * No permissions required.
         */
        if (requiredPermissions.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        const user = request.user as AuthenticatedUser | undefined;

        if (!user) {
            throw new UnauthorizedException(MESSAGES.ERROR.UNAUTHORIZED);
        }

        const hasPermissions = await this.permissionResolver.hasPermissions(
            user.id,
            requiredPermissions,
        );

        if (!hasPermissions) {
            throw new ForbiddenException(MESSAGES.ERROR.FORBIDDEN);
        }

        return true;
    }
}
