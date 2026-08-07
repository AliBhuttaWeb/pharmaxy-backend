import { ROLES } from '@/common/constants';
import { SeedContext } from '../seed.type';
import { MESSAGES } from 'prisma/seed.messages';

export async function seedRoles({ prisma }: SeedContext) {
    for (const role of Object.values(ROLES)) {
        await prisma.role.upsert({
            where: {
                name: role.name,
            },

            update: {
                description: role.description,
            },

            create: {
                name: role.name,
                description: role.description,
            },
        });
    }

    console.log(MESSAGES.SUCCESS.ROLES_SEEDED);
}
