import { isSuperAdmin } from '@/common/helpers';
import { CreateUserDto } from '../dtos';
import { AuthenticatedUser } from '@/modules/auth/types';
import { ROLE_SCOPES } from '@/common/constants';
import { MESSAGES as BRANCH_MESSAGES } from '@modules/branches/constants';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { MESSAGES } from '../constants';

export const resolveUserScope = (dto: CreateUserDto, currentUser: AuthenticatedUser) => {
    const isUserSuperAdmin = isSuperAdmin(currentUser.roles);

    if (!isUserSuperAdmin) {
        if (dto.role_scope !== ROLE_SCOPES.BRANCH) {
            throw new ForbiddenException(MESSAGES.ERROR.BRANCH_SCOPED_USERS_ALLOWED_TO_BE_CREATED);
        }

        const pharmacyId = dto.pharmacy_id ?? currentUser.pharmacy_id;
        if (!pharmacyId) {
            throw new BadRequestException(BRANCH_MESSAGES.ERROR.PHARMACY_ID_REQUIRED);
        }

        if (!dto.branch_id) {
            throw new BadRequestException(BRANCH_MESSAGES.ERROR.BRANCH_ID_REQUIRED);
        }

        return {
            pharmacyId,
            branchId: dto.branch_id,
        };
    }

    if (dto.role_scope === ROLE_SCOPES.GLOBAL) {
        return {
            pharmacyId: undefined,
            branchId: undefined,
        };
    }

    if (dto.role_scope === ROLE_SCOPES.PHARMACY) {
        if (!dto.pharmacy_id) {
            throw new BadRequestException(BRANCH_MESSAGES.ERROR.PHARMACY_ID_REQUIRED);
        }
        return {
            pharmacyId: dto.pharmacy_id,
            branchId: undefined,
        };
    }

    if (dto.role_scope === ROLE_SCOPES.BRANCH) {
        if (!dto.pharmacy_id) {
            throw new BadRequestException(BRANCH_MESSAGES.ERROR.PHARMACY_ID_REQUIRED);
        }

        if (!dto.branch_id) {
            throw new BadRequestException(BRANCH_MESSAGES.ERROR.BRANCH_ID_REQUIRED);
        }

        return {
            pharmacyId: dto.pharmacy_id,
            branchId: dto.branch_id,
        };
    }

    throw new ForbiddenException(MESSAGES.ERROR.INVALID_ROLE_SCOPE);
};
