import { Injectable } from '@nestjs/common';
import { Prisma } from '@gen/prisma/client';
import { PrismaService } from '@/database/prisma/prisma.service';
import { SystemLogQueryDto } from '../dtos';

@Injectable()
export class SystemLogsRepository {
    constructor(private readonly prisma: PrismaService) {}

    private readonly includeRelations: Prisma.SystemLogInclude = {
        user: {
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
            },
        },
        branch: {
            select: {
                id: true,
                name: true,
            },
        },
    };

    async findMany(pharmacyId: string | undefined, query: SystemLogQueryDto) {
        const { page, limit, level, source, search } = query;

        const where: Prisma.SystemLogWhereInput = {
            ...(pharmacyId && { pharmacy_id: pharmacyId }),
            ...(level && { level }),
            ...(source && { source }),
            ...(search && {
                OR: [
                    { event: { contains: search, mode: 'insensitive' } },
                    { message: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            const records = await this.prisma.systemLog.findMany({
                where,
                orderBy: { created_at: 'desc' },
                include: this.includeRelations,
            });
            return { records };
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.systemLog.findMany({
                where,
                orderBy: { created_at: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: this.includeRelations,
            }),
            this.prisma.systemLog.count({ where }),
        ]);

        return { records, total };
    }
}
