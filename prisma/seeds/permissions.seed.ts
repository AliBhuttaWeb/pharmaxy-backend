import * as permissions from '@common/constants/permissions';

import { SeedContext } from '../seed.type';
import { MESSAGES } from 'prisma/seed.messages';

function formatModuleName(key: string): string {
    const raw = key.replace(/_PERMISSIONS$/, '');
    if (raw === 'POS') return 'Point of Sale';
    return raw
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export async function seedPermissions({ prisma }: SeedContext) {
    for (const [groupKey, group] of Object.entries(permissions)) {
        if (!groupKey.endsWith('_PERMISSIONS') || typeof group !== 'object' || group === null) {
            continue;
        }

        const moduleName = formatModuleName(groupKey);

        for (const permission of Object.values(
            group as Record<string, { name: string; description: string }>,
        )) {
            if (!permission?.name) continue;

            await prisma.permission.upsert({
                where: {
                    name: permission.name,
                },
                update: {
                    description: permission.description,
                    module: moduleName,
                },
                create: {
                    name: permission.name,
                    description: permission.description,
                    module: moduleName,
                },
            });
        }
    }

    console.log(MESSAGES.SUCCESS.PERMISSIONS_SEEDED);
}


