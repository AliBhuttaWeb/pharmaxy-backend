import { AuthenticatedRole } from '@/modules/auth/types';
import { RoleScope, SignupScope } from '@gen/prisma/enums';
import { RoleSummary } from '../types';

export function hasRoleScope(roles: AuthenticatedRole[], scope: RoleScope): boolean {
    return roles.some((role) => role.role_scope === scope);
}

export function canSignup(role: RoleSummary, scope: SignupScope): boolean {
    return role.signup_scope === scope;
}

export function requiresBranchContext(roles: AuthenticatedRole[]): boolean {
    return hasRoleScope(roles, RoleScope.BRANCH);
}
