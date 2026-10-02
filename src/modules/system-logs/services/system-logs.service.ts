import { Injectable } from '@nestjs/common';
import { AuthenticatedUser } from '@/modules/auth/types';
import { isSuperAdmin } from '@/common/helpers';
import { buildPaginationMeta } from '@/common/pagination';
import { SystemLogQueryDto } from '../dtos';
import { SystemLogsRepository } from '../repositories/system-logs.repository';

@Injectable()
export class SystemLogsService {
    constructor(private readonly systemLogsRepository: SystemLogsRepository) {}

    async findMany(user: AuthenticatedUser, query: SystemLogQueryDto) {
        const pharmacyId = !isSuperAdmin(user.roles) ? (user.pharmacy_id || undefined) : undefined;
        const { limit, page } = query;
        const { records, total } = await this.systemLogsRepository.findMany(pharmacyId, query);
        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
        return { records, pagination };
    }
}
