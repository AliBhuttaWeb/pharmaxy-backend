import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    CreateBranchDto,
    FindBranchesQueryDto,
    UpdateBranchDto,
    UpdateBranchStatusDto,
} from '../dtos';

import { MESSAGES } from '../constants/messages.constants';
import { BranchesRepository } from '../repositories/branches.repository';
import { SubscriptionConstraintService } from '@/modules/subscriptions/services/subscription-constraint.service';
import { AuthenticatedUser } from '@/modules/auth/types';
import { isSuperAdmin } from '@/common/helpers';
import { Branch } from '@gen/prisma/client';
import { buildPaginationMeta } from '@/common/pagination';

@Injectable()
export class BranchesService {
    constructor(
        private readonly branchesRepository: BranchesRepository,
        private readonly subscriptionConstraintService: SubscriptionConstraintService,
    ) {}

    async list(query: FindBranchesQueryDto) {
        const { limit, page } = query;
        const { records, total } = await this.branchesRepository.findMany(query);

        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
        return { records, pagination };
    }

    async get(id: string) {
        const branch = await this.branchesRepository.findById(id);

        if (!branch) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return { branch };
    }

    async create(dto: CreateBranchDto, currentUser: AuthenticatedUser) {
        const targetPharmacyId = isSuperAdmin(currentUser.roles)
            ? dto.pharmacy_id
            : (currentUser.pharmacy_id ?? dto.pharmacy_id);

        const currentBranchCount =
            await this.branchesRepository.countByPharmacyId(targetPharmacyId);

        // Enforce subscription branch limit (SUPER_ADMIN is automatically bypassed)
        await this.subscriptionConstraintService.validateBranchesLimit({
            currentBranchCount,
            pharmacyId: targetPharmacyId,
        });

        const existingBranch = await this.branchesRepository.findByName(targetPharmacyId, dto.name);

        if (existingBranch) {
            throw new ConflictException(MESSAGES.ERROR.NAME_ALREADY_EXISTS);
        }

        if (dto.is_main) {
            const mainBranch = await this.branchesRepository.findMainBranch(targetPharmacyId);

            if (mainBranch) {
                throw new ConflictException(MESSAGES.ERROR.MAIN_BRANCH_ALREADY_EXISTS);
            }
        }

        const branch = await this.branchesRepository.create({
            ...dto,
            is_main: dto.is_main || !currentBranchCount,
            pharmacy_id: targetPharmacyId,
        });

        return {
            branch,
            message: MESSAGES.SUCCESS.CREATED,
        };
    }

    async update(id: string, dto: UpdateBranchDto) {
        const branch = await this.branchesRepository.findById(id);

        if (!branch) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        if (dto.name && dto.name !== branch.name) {
            const existingBranch = await this.branchesRepository.findByName(
                branch.pharmacy_id,
                dto.name,
            );

            if (existingBranch && existingBranch.id !== id) {
                throw new ConflictException(MESSAGES.ERROR.NAME_ALREADY_EXISTS);
            }
        }

        if (dto.is_main && !branch.is_main) {
            const mainBranch = await this.branchesRepository.findMainBranch(branch.pharmacy_id);

            if (mainBranch) {
                throw new ConflictException(MESSAGES.ERROR.MAIN_BRANCH_ALREADY_EXISTS);
            }
        }

        const updatedBranch = await this.branchesRepository.update(id, dto);

        return {
            branch: updatedBranch,
            message: MESSAGES.SUCCESS.UPDATED,
        };
    }

    async updateStatus(id: string, dto: UpdateBranchStatusDto) {
        const branch = await this.branchesRepository.findById(id);

        if (!branch) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        const updatedBranch = await this.branchesRepository.updateStatus(id, dto.is_active);

        return {
            branch: updatedBranch,
            message: MESSAGES.SUCCESS.STATUS_UPDATED,
        };
    }

    async delete(id: string) {
        const branch = await this.branchesRepository.findById(id);

        if (!branch) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        await this.branchesRepository.delete(id);

        return {
            message: MESSAGES.SUCCESS.DELETED,
        };
    }

    async findById(id: string) {
        const branch = await this.branchesRepository.findById(id);

        if (!branch) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return branch;
    }

    async countByPharmacyId(pharmacyId: string) {
        return this.branchesRepository.countByPharmacyId(pharmacyId);
    }

    async findAvailableForUser(userId: string) {
        return this.branchesRepository.findAvailableForUser(userId);
    }

    async findAvailableBranchesForUser(
        userId: string,
        pharmacyId: string | null,
        isSuperAdmin: boolean,
        isPharmacyAdmin: boolean,
    ): Promise<Branch[]> {
        if (isSuperAdmin || !pharmacyId) {
            return [];
        }

        if (isPharmacyAdmin) {
            return this.branchesRepository.findByPharmacyId(pharmacyId);
        }

        return this.branchesRepository.findByUserId(userId);
    }

    async ensureUserHasAccess(user: AuthenticatedUser, branchId: string): Promise<void> {
        if (isSuperAdmin(user.roles)) {
            return;
        }

        const hasAccess = await this.branchesRepository.userHasAccessToBranch(user, branchId);

        if (!hasAccess) {
            throw new ForbiddenException(MESSAGES.ERROR.BRANCH_ACCESS_DENIED);
        }
    }
}
