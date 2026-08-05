import * as bcrypt from 'bcrypt';

import { ROLES } from '@/common/constants';

import { MESSAGES } from 'prisma/seed.messages';
import { SeedContext } from 'prisma/seed.type';

export async function seedUsers({ prisma }: SeedContext): Promise<void> {
    const {
        SUPER_ADMIN_FIRST_NAME,
        SUPER_ADMIN_LAST_NAME,
        SUPER_ADMIN_EMAIL,
        SUPER_ADMIN_PHONE,
        SUPER_ADMIN_PASSWORD,
    } = process.env;

    if (!SUPER_ADMIN_FIRST_NAME || !SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) {
        throw new Error(MESSAGES.ERROR.SUPER_ADMIN_ENV_MISSING);
    }

    const role = await prisma.role.findUnique({
        where: {
            name: ROLES.SUPER_ADMIN.name,
        },
    });

    if (!role) {
        throw new Error(MESSAGES.ERROR.SUPER_ADMIN_ROLE_NOT_FOUND);
    }

    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 12);

    const user = await prisma.user.upsert({
        where: {
            email: SUPER_ADMIN_EMAIL,
        },

        update: {
            first_name: SUPER_ADMIN_FIRST_NAME,
            last_name: SUPER_ADMIN_LAST_NAME ?? null,
            phone: SUPER_ADMIN_PHONE ?? null,
            password: hashedPassword,
            is_email_verified: true,
            is_phone_verified: !!SUPER_ADMIN_PHONE,
            status: 'ACTIVE',
        },

        create: {
            first_name: SUPER_ADMIN_FIRST_NAME,
            last_name: SUPER_ADMIN_LAST_NAME ?? null,
            email: SUPER_ADMIN_EMAIL,
            phone: SUPER_ADMIN_PHONE ?? null,
            password: hashedPassword,
            is_email_verified: true,
            is_phone_verified: !!SUPER_ADMIN_PHONE,
            status: 'ACTIVE',
        },
    });

    const existingUserRole = await prisma.userRole.findFirst({
        where: {
            user_id: user.id,
            role_id: role.id,
        },
    });

    if (!existingUserRole) {
        await prisma.userRole.create({
            data: {
                user_id: user.id,
                role_id: role.id,
            },
        });
    }

    console.log(MESSAGES.SUCCESS.SUPER_ADMIN_CREATED);
}
