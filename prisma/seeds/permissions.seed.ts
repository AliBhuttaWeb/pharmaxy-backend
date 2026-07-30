import * as permissions from '@common/constants/permissions';

import { SeedContext } from '../seed.type';
import { MESSAGES } from 'prisma/seed.messages';

const permissionList = Object.values(permissions).flatMap((group) => Object.values(group));

export async function seedPermissions({ prisma }: SeedContext) {
    for (const permission of permissionList) {
        await prisma.permission.upsert({
            where: {
                name: permission.name,
            },

            update: {
                description: permission.description,
            },

            create: permission,
        });
    }

    console.log(MESSAGES.SUCCESS.PERMISSIONS_SEEDED);
}
