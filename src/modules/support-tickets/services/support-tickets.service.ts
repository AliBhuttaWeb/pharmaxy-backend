import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '@/modules/auth/types';
import { getActivePharmacyId } from '@/common/helpers';
import { buildPaginationMeta } from '@/common/pagination';
import { CreateSupportTicketDto, SupportTicketQueryDto, UpdateSupportTicketStatusDto } from '../dtos';
import { SupportTicketsRepository } from '../repositories/support-tickets.repository';
import { MESSAGES } from '../constants';

@Injectable()
export class SupportTicketsService {
    constructor(private readonly supportTicketsRepository: SupportTicketsRepository) {}

    async findMany(user: AuthenticatedUser, query: SupportTicketQueryDto) {
        const pharmacyId = getActivePharmacyId(user);
        const { limit, page } = query;
        const { records, total } = await this.supportTicketsRepository.findMany(pharmacyId, query);
        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
        return { records, pagination };
    }

    async findById(id: string, user: AuthenticatedUser) {
        const pharmacyId = getActivePharmacyId(user);
        const ticket = await this.supportTicketsRepository.findById(id, pharmacyId);
        if (!ticket) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }
        return { ticket };
    }

    async create(dto: CreateSupportTicketDto, user: AuthenticatedUser) {
        const pharmacyId = getActivePharmacyId(user);
        const ticket = await this.supportTicketsRepository.create(pharmacyId, user.id, dto);
        return { ticket, message: MESSAGES.SUCCESS.CREATED };
    }

    async updateStatus(id: string, dto: UpdateSupportTicketStatusDto, user: AuthenticatedUser) {
        await this.findById(id, user);
        const pharmacyId = getActivePharmacyId(user);
        const ticket = await this.supportTicketsRepository.updateStatus(id, pharmacyId, dto);
        return { ticket, message: MESSAGES.SUCCESS.STATUS_UPDATED };
    }
}
