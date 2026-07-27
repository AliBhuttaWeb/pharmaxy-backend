import { Prisma } from '@prisma/client';
import { userWithPermissionsQuery } from '../queries';

export type UserWithPermissions = Prisma.UserGetPayload<typeof userWithPermissionsQuery>;
