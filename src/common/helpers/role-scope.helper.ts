import { ROLE_SCOPES, ROLES } from '@/common/constants';
import { AuthenticatedRole } from '@/modules/auth/types';
import { Role, RoleScope, SignupScope } from '../types';

const ROLE_MAP = Object.fromEntries(
    Object.values(ROLES).map((role) => [role.name, role]),
) as Record<Role, (typeof ROLES)[keyof typeof ROLES]>;

function getRoleDefinition(role: Role) {
    return ROLE_MAP[role];
}

export function getRoleScope(role: Role): RoleScope {
    return getRoleDefinition(role).roleScope;
}

export function canSignup(role: Role, scope: SignupScope): boolean {
    return getRoleDefinition(role).signupScopes.includes(scope);
}

export function isSystemRole(role: Role): boolean {
    return getRoleScope(role) === ROLE_SCOPES.SYSTEM;
}

export function isSupplierRole(role: Role): boolean {
    return getRoleScope(role) === ROLE_SCOPES.SUPPLIER;
}

export function isPharmacyRole(role: Role): boolean {
    return getRoleScope(role) === ROLE_SCOPES.PHARMACY;
}

export function hasRoleScope(roles: AuthenticatedRole[], scope: RoleScope): boolean {
    return roles.some((role) => getRoleScope(role.name) === scope);
}

export function requiresBranchContext(roles: AuthenticatedRole[]): boolean {
    return hasRoleScope(roles, ROLE_SCOPES.PHARMACY);
}
