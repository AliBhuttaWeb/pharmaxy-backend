import type { Prisma } from '@prisma/client';
import { userWithPermissionsQuery } from '../queries/user-with-permissions.query';

export type UserWithPermissions = Prisma.UserGetPayload<typeof userWithPermissionsQuery>;
