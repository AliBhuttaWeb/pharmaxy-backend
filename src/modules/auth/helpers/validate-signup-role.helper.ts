import { BadRequestException, ForbiddenException } from '@nestjs/common';

import { Role } from '@gen/prisma/client';

import { SignupScope } from '../types';
import { canSignup } from '@common/helpers';
import { MESSAGES } from '@/common/constants';

export function validateSignupRole(
    role: Pick<Role, 'name'> | null,
    signupScope: SignupScope,
): asserts role is Pick<Role, 'name'> {
    if (!role) {
        throw new BadRequestException(MESSAGES.ERROR.INVALID_ROLE);
    }

    if (!canSignup(role.name, signupScope)) {
        throw new ForbiddenException(MESSAGES.ERROR.ROLE_NOT_ALLOWED_FOR_SIGNUP);
    }
}
