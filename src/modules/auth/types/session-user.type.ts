import { UserStatus } from '@prisma/client';

import { Permission } from '@/common/types';

export interface SessionUser {
    id: string;

    email: string;

    firstName: string;

    lastName: string | null;

    status: UserStatus;

    activeBranchId: string | null;

    roleId: string;

    roleName: string;

    permissions: Permission[];
}
