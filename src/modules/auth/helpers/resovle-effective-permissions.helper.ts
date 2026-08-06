import { UserWithPermissions } from '../types';

export function resolveEffectivePermissions(user: UserWithPermissions) {
    const rolePermissions = user.user_roles.flatMap(({ role }) =>
        role.role_permissions.map(({ permission }) => permission.name),
    );

    const directPermissions = user.user_permissions.map(({ permission }) => permission.name);

    return [...new Set([...rolePermissions, ...directPermissions])];
}
