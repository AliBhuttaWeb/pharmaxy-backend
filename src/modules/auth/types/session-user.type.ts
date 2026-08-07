import { UserStatus } from '@gen/prisma/client';

export interface SessionUser {
    id: string;

    email: string;

    firstName: string;

    lastName: string | null;

    status: UserStatus;

    branch_id: string | null;

    roleId: string;

    roleName: string;

    permissions: string[];
}
