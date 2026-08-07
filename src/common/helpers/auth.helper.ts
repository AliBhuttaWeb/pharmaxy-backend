import { ConflictException } from '@nestjs/common';

import { AuthenticatedUser } from '@/modules/auth/types';
import { MESSAGES, ROLES } from '../constants';
import { Role } from '@gen/prisma/client';
import { RoleLike } from '../types/role-like.type';

export function getActiveBranchId(user: AuthenticatedUser): string {
    if (!user.branch_id) {
        throw new ConflictException(MESSAGES.ERROR.NO_ACTIVE_BRANCH);
    }

    return user.branch_id;
}

export function getPharmacyId(user: AuthenticatedUser): string | null {
    return user.pharmacy_id;
}

export function hasRole(roles: RoleLike[], roleName: Role | string): boolean {
    return roles.some((role) => role.name === roleName);
}

export function isSuperAdmin(roles: RoleLike[]): boolean {
    return hasRole(roles, ROLES.SUPER_ADMIN.name);
}

export function isPharmacyAdmin(roles: RoleLike[]): boolean {
    return hasRole(roles, ROLES.PHARMACY_ADMIN.name);
}
