import { ConflictException } from '@nestjs/common';

import { AuthenticatedUser } from '@/modules/auth/types';

export function getActiveBranchId(user: AuthenticatedUser): string {
    if (!user.activeBranchId) {
        throw new ConflictException('No active branch selected');
    }

    return user.activeBranchId;
}
