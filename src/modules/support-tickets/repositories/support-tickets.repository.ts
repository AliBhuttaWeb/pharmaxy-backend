import { Injectable } from '@nestjs/common';
import { Prisma } from '@gen/prisma/client';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateSupportTicketDto, SupportTicketQueryDto, UpdateSupportTicketStatusDto } from '../dtos';

@Injectable()
export class SupportTicketsRepository {
    constructor(private readonly prisma: PrismaService) {}

    private readonly includeRelations: Prisma.SupportTicketInclude = {
        creator: {
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                avatar_url: true,
            },
        },
        messages: {
            orderBy: {
                created_at: 'asc',
            },
        },
    };

    async findMany(pharmacyId: string, query: SupportTicketQueryDto) {
        const { page, limit, status, search } = query;

        const where: Prisma.SupportTicketWhereInput = {
            pharmacy_id: pharmacyId,
            ...(status && { status }),
            ...(search && {
                OR: [
                    { subject: { contains: search, mode: 'insensitive' } },
                    { ticket_number: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            const records = await this.prisma.supportTicket.findMany({
                where,
                orderBy: { created_at: 'desc' },
                include: this.includeRelations,
            });
            return { records };
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.supportTicket.findMany({
                where,
                orderBy: { created_at: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: this.includeRelations,
            }),
            this.prisma.supportTicket.count({ where }),
        ]);

        return { records, total };
    }

    async findById(id: string, pharmacyId: string) {
        return this.prisma.supportTicket.findFirst({
            where: { id, pharmacy_id: pharmacyId },
            include: this.includeRelations,
        });
    }

    async create(pharmacyId: string, userId: string, dto: CreateSupportTicketDto) {
        const count = await this.prisma.supportTicket.count({ where: { pharmacy_id: pharmacyId } });
        const ticketNumber = `TK-${String(count + 1).padStart(4, '0')}`;

        const data: Prisma.SupportTicketCreateInput = {
            pharmacy: { connect: { id: pharmacyId } },
            creator: { connect: { id: userId } },
            ticket_number: ticketNumber,
            subject: dto.subject,
            ...(dto.message && {
                messages: {
                    create: {
                        user: { connect: { id: userId } },
                        message: dto.message,
                    },
                },
            }),
        };

        return this.prisma.supportTicket.create({
            data,
            include: this.includeRelations,
        });
    }

    async updateStatus(id: string, pharmacyId: string, dto: UpdateSupportTicketStatusDto) {
        return this.prisma.supportTicket.update({
            where: { id },
            data: { status: dto.status },
            include: this.includeRelations,
        });
    }
}
