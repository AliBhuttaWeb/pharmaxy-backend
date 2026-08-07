import { Prisma } from '@gen/prisma/client';
import { userWithRolesAndBranchesQuery } from '../queries';

export type UserWithRolesAndBranchesQuery = Prisma.UserGetPayload<
    typeof userWithRolesAndBranchesQuery
>;
