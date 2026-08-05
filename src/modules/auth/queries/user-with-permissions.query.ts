import { Prisma } from '@prisma/client';

export const userWithPermissionsQuery = {
    include: {
        user_roles: {
            include: {
                role: {
                    include: {
                        role_permissions: {
                            include: {
                                permission: true,
                            },
                        },
                    },
                },
            },
        },
        user_permissions: {
            include: {
                permission: true,
            },
        },
        user_branches: {
            include: {
                branch: true,
            },
        },
    },
} satisfies Prisma.UserDefaultArgs;
