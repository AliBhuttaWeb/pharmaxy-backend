import { ROLES } from '@/common/constants/roles.constants';

import type { Role } from '@/common/types/role.type';

const BRANCH_SCOPED_ROLES = new Set<Role>([ROLES.PHARMACY_OWNER, ROLES.CASHIER]);

export function isBranchScopedRole(role: Role): boolean {
    return BRANCH_SCOPED_ROLES.has(role);
}

export function isNonBranchScopedRole(role: Role): boolean {
    return !isBranchScopedRole(role);
}
