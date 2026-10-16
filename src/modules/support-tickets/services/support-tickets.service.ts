import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '@/modules/auth/types';
import { getActiveBranchId, isSuperAdmin } from '@/common/helpers';
import { buildPaginationMeta } from '@/common/pagination';
import { CreateSupportTicketDto, SupportTicketQueryDto, UpdateSupportTicketStatusDto } from '../dtos';
import { SupportTicketsRepository } from '../repositories/support-tickets.repository';
import { MESSAGES } from '../constants';

@Injectable()
export class SupportTicketsService {
    constructor(private readonly supportTicketsRepository: SupportTicketsRepository) {}

    async findMany(user: AuthenticatedUser, query: SupportTicketQueryDto) {
        const isUserSuperAdmin = isSuperAdmin(user.roles);
        const branchId = isUserSuperAdmin ? query.branch_id : getActiveBranchId(user);
        const { limit, page } = query;
        const { records, total } = await this.supportTicketsRepository.findMany(branchId, query);
        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
        return { records, pagination };
    }

    async findById(id: string, user: AuthenticatedUser) {
        const isUserSuperAdmin = isSuperAdmin(user.roles);
        const branchId = isUserSuperAdmin ? undefined : getActiveBranchId(user);
        const ticket = await this.supportTicketsRepository.findById(id, branchId);
        if (!ticket) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }
        return { ticket };
    }

    async create(dto: CreateSupportTicketDto, user: AuthenticatedUser) {
        const isUserSuperAdmin = isSuperAdmin(user.roles);
        const branchId = isUserSuperAdmin ? (dto.branch_id || user.branch_id) : getActiveBranchId(user);
        if (!branchId) {
            throw new BadRequestException('branch_id is required to create a support ticket.');
        }
        const ticket = await this.supportTicketsRepository.create(branchId, user.id, dto);
        return { ticket, message: MESSAGES.SUCCESS.CREATED };
    }

    async updateStatus(id: string, dto: UpdateSupportTicketStatusDto, user: AuthenticatedUser) {
        await this.findById(id, user);
        const ticket = await this.supportTicketsRepository.updateStatus(id, dto);
        return { ticket, message: MESSAGES.SUCCESS.STATUS_UPDATED };
    }
}
