import { SeedContext } from '../seed.types';

import { DEFAULT_ROLE_PERMISSIONS } from '@/modules/roles/constants';

export async function seedRolePermissions({ prisma, roles, permissions }: SeedContext) {
    for (const [roleName, permissionFactory] of Object.entries(DEFAULT_ROLE_PERMISSIONS)) {
        const role = roles.get(roleName);

        if (!role) {
            continue;
        }

        for (const permission of permissionFactory()) {
            const dbPermission = permissions.get(permission.name);

            if (!dbPermission) {
                continue;
            }

            await prisma.rolePermission.upsert({
                where: {
                    role_id_permission_id: {
                        role_id: role.id,
                        permission_id: dbPermission.id,
                    },
                },

                update: {},

                create: {
                    role_id: role.id,
                    permission_id: dbPermission.id,
                },
            });
        }
    }
}
