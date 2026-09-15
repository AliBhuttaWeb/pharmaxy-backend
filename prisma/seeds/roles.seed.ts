import { ROLES } from '@/common/constants';
import { SeedContext } from '../seed.type';
import { MESSAGES } from 'prisma/seed.messages';

export async function seedRoles({ prisma }: SeedContext) {
    // 1. Upsert all roles
    for (const role of Object.values(ROLES)) {
        const { parent, ...roleData } = role;

        await prisma.role.upsert({
            where: {
                name: roleData.name,
            },

            update: {
                description: roleData.description,
                role_scope: roleData.role_scope,
            },

            create: roleData,
        });
    }

    // 2. Link parent hierarchy dynamically from ROLES configuration
    for (const role of Object.values(ROLES)) {
        if (role.parent) {
            const parentRole = await prisma.role.findUnique({
                where: { name: role.parent },
            });

            if (parentRole) {
                await prisma.role.update({
                    where: { name: role.name },
                    data: { parent_id: parentRole.id },
                });
            }
        }
    }

    console.log(MESSAGES.SUCCESS.ROLES_SEEDED);
}
