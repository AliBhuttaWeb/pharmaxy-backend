import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import {
    CreateBranchDto,
    FindBranchesQueryDto,
    UpdateBranchDto,
    UpdateBranchStatusDto,
} from '../dtos';

import { MESSAGES } from '../constants/branches.constants';
import { BranchesRepository } from '../repositories/branches.repository';
import { SubscriptionsService } from '@/modules/subscriptions/services/subscriptions.service';
import { MESSAGES as SUBSCRIPTION_MESSAGES } from '@modules/subscriptions/constants';

@Injectable()
export class BranchesService {
    constructor(
        private readonly branchesRepository: BranchesRepository,
        private readonly subscriptionsService: SubscriptionsService,
    ) {}

    private async validateBranchLimit(pharmacyId: string) {
        const subscription = await this.subscriptionsService.ensureActiveSubscription(pharmacyId);

        const maxBranches = subscription.plan.max_branches;

        if (maxBranches == null) {
            return;
        }

        const totalBranches = await this.branchesRepository.countByPharmacyId(pharmacyId);

        if (totalBranches >= maxBranches) {
            throw new ConflictException(SUBSCRIPTION_MESSAGES.ERROR.BRANCH_LIMIT_REACHED);
        }
    }

    async list(query: FindBranchesQueryDto) {
        return this.branchesRepository.findMany(query);
    }

    async get(id: string) {
        const branch = await this.branchesRepository.findById(id);

        if (!branch) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return branch;
    }

    async create(dto: CreateBranchDto) {
        const existingBranch = await this.branchesRepository.findByName(dto.pharmacy_id, dto.name);

        if (existingBranch) {
            throw new ConflictException(MESSAGES.ERROR.NAME_ALREADY_EXISTS);
        }

        if (dto.is_main) {
            const mainBranch = await this.branchesRepository.findMainBranch(dto.pharmacy_id);

            if (mainBranch) {
                throw new ConflictException(MESSAGES.ERROR.MAIN_BRANCH_ALREADY_EXISTS);
            }
        }

        await this.validateBranchLimit(dto.pharmacy_id);

        await this.branchesRepository.create(dto);

        return {
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

        await this.branchesRepository.update(id, dto);

        return {
            message: MESSAGES.SUCCESS.UPDATED,
        };
    }

    async updateStatus(id: string, dto: UpdateBranchStatusDto) {
        const branch = await this.branchesRepository.findById(id);

        if (!branch) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        await this.branchesRepository.updateStatus(id, dto.is_active);

        return {
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
}
