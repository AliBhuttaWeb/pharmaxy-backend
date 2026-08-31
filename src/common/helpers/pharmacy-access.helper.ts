import { ForbiddenException } from '@nestjs/common';

import { RoleScope } from '@gen/prisma/client';

import { MESSAGES } from '@/common/constants';

import { AuthenticatedUser } from '@/modules/auth/types/authenticated-user.type';

export function assertPharmacyAccess(user: AuthenticatedUser, pharmacyId: string): void {
    const isGlobal = user.roles.some((role) => role.role_scope === RoleScope.GLOBAL);

    if (isGlobal) return;

    if (user.pharmacy_id === pharmacyId) {
        return;
    }

    throw new ForbiddenException(MESSAGES.ERROR.PHARMACY_ACCESS_DENIED);
}
