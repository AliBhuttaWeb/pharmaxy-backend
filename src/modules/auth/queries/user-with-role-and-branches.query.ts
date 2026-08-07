import { Prisma } from '@gen/prisma/client';

export const userWithRolesAndBranchesQuery = {
    include: {
        user_roles: {
            include: {
                role: true,
            },
        },
        user_branches: {
            include: {
                branch: true,
            },
        },
    },
} satisfies Prisma.UserDefaultArgs;
