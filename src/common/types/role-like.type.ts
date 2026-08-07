import { Role } from '@prisma/client';

export type RoleLike = {
    name: Role | string;
};
