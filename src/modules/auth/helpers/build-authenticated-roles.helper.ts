import { AuthenticatedRole, UserWithPermissions } from '../types';
import { Role } from '@common/types';

export function buildAuthenticatedRoles(user: UserWithPermissions): AuthenticatedRole[] {
    return user.user_roles.map((userRole) => ({
        id: userRole.id,
        name: userRole.role.name as Role,
    }));
}
