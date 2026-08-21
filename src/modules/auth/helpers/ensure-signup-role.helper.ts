import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { MESSAGES } from '../constants';
import { RoleSummary, SignupScope } from '@/common/types';
import { canSignup } from '@/common/helpers';
import { Role } from '@gen/prisma/client';

export function ensureSignupRole(role: RoleSummary | null, signupScope: SignupScope) {
    if (!role) {
        throw new BadRequestException(MESSAGES.ERROR.INVALID_ROLE);
    }

    if (!canSignup(role, signupScope)) {
        throw new ForbiddenException(MESSAGES.ERROR.ROLE_NOT_ALLOWED_FOR_SIGNUP);
    }
}
