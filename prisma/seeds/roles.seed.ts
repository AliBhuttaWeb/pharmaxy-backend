import { ROLES } from '@/common/constants';
import { SeedContext } from '../seed.type';

export async function seedRoles({ prisma }: SeedContext) {
    for (const role of Object.values(ROLES)) {
        await prisma.role.upsert({
            where: {
                name: role.name,
            },

            update: {
                description: role.description,
            },

            create: role,
        });
    }
}
