import { ROLES } from '@/common/constants';

import type { Role } from '@/common/types';

const BRANCH_SCOPED_ROLES = new Set<Role>([ROLES.PHARMACY_ADMIN.name, ROLES.CASHIER.name]);

export function isBranchScopedRole(role: Role): boolean {
    return BRANCH_SCOPED_ROLES.has(role);
}

export function isNonBranchScopedRole(role: Role): boolean {
    return !isBranchScopedRole(role);
}
