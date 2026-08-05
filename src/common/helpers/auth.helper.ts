import { ConflictException } from '@nestjs/common';

import { AuthenticatedUser } from '@/modules/auth/types';
import { MESSAGES, ROLES } from '../constants';

export function getActiveBranchId(user: AuthenticatedUser): string {
    if (!user.activeBranchId) {
        throw new ConflictException(MESSAGES.ERROR.NO_ACTIVE_BRANCH);
    }

    return user.activeBranchId;
}

export function getPharmacyId(user: AuthenticatedUser): string | null {
    return user.pharmacyId;
}

export function isSuperAdmin(user: AuthenticatedUser): boolean {
    return user.roles.some((role) => role.name === ROLES.SUPER_ADMIN.name);
}
