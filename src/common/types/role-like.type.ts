import { Role } from '@gen/prisma/client';

export type RoleLike = {
    name: Role | string;
};
