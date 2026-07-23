import { Prisma } from '@prisma/client';

export type UserWithPermissions = Prisma.UserGetPayload<{
    include: {
        user_roles: {
            include: {
                role: {
                    include: {
                        role_permissions: {
                            include: {
                                permission: true;
                            };
                        };
                    };
                };
            };
        };
        user_permissions: {
            include: {
                permission: true;
            };
        };
    };
}>;
