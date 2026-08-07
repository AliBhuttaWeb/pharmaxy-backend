import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { MESSAGES } from '../constants';
import { SignupScope } from '@/common/types';
import { Role } from '@common/types';
import { canSignup } from '@/common/helpers';

export function ensureSignupRole(
    role: { name: string } | null,
    signupScope: SignupScope,
): asserts role is { name: Role } {
    if (!role) {
        throw new BadRequestException(MESSAGES.ERROR.INVALID_ROLE);
    }

    if (!canSignup(role.name as Role, signupScope)) {
        throw new ForbiddenException(MESSAGES.ERROR.ROLE_NOT_ALLOWED_FOR_SIGNUP);
    }
}
