import { ConflictException } from '@nestjs/common';

import { AuthenticatedUser } from '@/modules/auth/types';
import { MESSAGES } from '../constants';

export function getActiveBranchId(user: AuthenticatedUser): string {
    if (!user.activeBranchId) {
        throw new ConflictException(MESSAGES.ERROR.NO_ACTIVE_BRANCH_SELECTED);
    }

    return user.activeBranchId;
}
