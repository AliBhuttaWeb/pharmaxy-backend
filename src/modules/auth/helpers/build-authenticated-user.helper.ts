import { AuthenticatedUser, UserWithPermissions } from '../types';
import { buildAuthenticatedRoles } from './build-authenticated-roles.helper';
import { resolveEffectivePermissions } from './resovle-effective-permissions.helper';

export function buildAuthenticatedUser(
    user: UserWithPermissions,
    branchId: string | null = null,
): AuthenticatedUser {
    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        is_email_verified: user.is_email_verified,
        is_phone_verified: user.is_phone_verified,
        pharmacy_id: user.pharmacy_id,
        branch_id: branchId,
        status: user.status,
        roles: buildAuthenticatedRoles(user),
        permissions: resolveEffectivePermissions(user),
    };
}
