import { Injectable, NotFoundException } from '@nestjs/common';
import { InvoicesRepository } from '../repositories/invoices.repository';
import { FindInvoicesQueryDto } from '../dtos';
import { AuthenticatedUser } from '@/modules/auth/types';
import { getActiveBranchId, isSuperAdmin } from '@/common/helpers';
import { buildPaginationMeta } from '@/common/pagination';
import { Prisma } from '@gen/prisma/client';
import { MESSAGES } from '../constants';

@Injectable()
export class InvoicesService {
    constructor(private readonly invoicesRepository: InvoicesRepository) {}

    findLatestInvoice(branchId: string, tx?: Prisma.TransactionClient) {
        return this.invoicesRepository.findLatestInvoice(branchId, tx);
    }

    createInvoice(data: Prisma.InvoiceCreateInput, tx?: Prisma.TransactionClient) {
        return this.invoicesRepository.createInvoice(data, tx);
    }

    async list(query: FindInvoicesQueryDto, user: AuthenticatedUser) {
        const page = Math.max(1, Number(query?.page) || 1);
        const limit = Math.max(1, Math.min(100, Number(query?.limit) || 10));
        const skip = (page - 1) * limit;

        const where: Prisma.InvoiceWhereInput = {
            deleted_at: null,
        };

        if (!isSuperAdmin(user.roles)) {
            where.pharmacy_id = user.pharmacy_id!;
            const branchId = getActiveBranchId(user);
            if (branchId) {
                where.branch_id = branchId;
            }
        } else if (query?.branch_id) {
            where.branch_id = query.branch_id;
        }

        if (query?.customer_id) {
            where.customer_id = query.customer_id;
        }

        if (query?.status) {
            where.status = query.status;
        }

        if (query?.search) {
            where.OR = [
                { invoice_number: { contains: query.search, mode: 'insensitive' } },
                { customer: { is: { first_name: { contains: query.search, mode: 'insensitive' } } } },
                { customer: { is: { last_name: { contains: query.search, mode: 'insensitive' } } } },
            ];
        }

        const [records, total] = await Promise.all([
            this.invoicesRepository.findMany(where, { skip, take: limit }),
            this.invoicesRepository.count(where),
        ]);

        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });

        return {
            records,
            pagination,
        };
    }

    async get(id: string, user: AuthenticatedUser) {
        const invoice = await this.invoicesRepository.findById(id);

        if (!invoice) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        if (!isSuperAdmin(user.roles) && invoice.pharmacy_id !== user.pharmacy_id) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return { invoice };
    }
}
