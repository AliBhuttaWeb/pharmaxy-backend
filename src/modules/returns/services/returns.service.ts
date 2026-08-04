import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/database/prisma/prisma.service';

import { AuthenticatedUser } from '@/modules/auth/types';

import { BranchContextService } from '@/common/services/branch-context.service';

import { CreateReturnDto, ReturnQueryDto } from '../dtos';

import { ReturnsRepository } from '../repositories/returns.repository';

import { MESSAGES } from '../constants';

import { PreparedReturnBatch, PreparedReturnItem } from '../types';
import { ReturnStatus } from '@prisma/enums';

@Injectable()
export class ReturnsService {
    constructor(
        private readonly prisma: PrismaService,

        private readonly returnsRepository: ReturnsRepository,

        private readonly branchContextService: BranchContextService,
    ) {}

    async create(
        dto: CreateReturnDto,

        user: AuthenticatedUser,
    ) {
        const { branchId, pharmacyId } = await this.branchContextService.get(user);

        return this.prisma.$transaction(async (tx) => {
            const invoice = await this.returnsRepository.findInvoiceForReturn(dto.invoice_id, tx);

            if (!invoice) {
                throw new NotFoundException(MESSAGES.ERROR.INVOICE_NOT_FOUND);
            }

            if (invoice.branch_id !== branchId) {
                throw new ConflictException(MESSAGES.ERROR.INVOICE_BRANCH_MISMATCH);
            }

            let refundAmount = 0;

            const preparedItems: PreparedReturnItem[] = [];

            for (const item of dto.items) {
                const invoiceItem = invoice.items.find(
                    (invoiceItem) => invoiceItem.id === item.invoice_item_id,
                );

                if (!invoiceItem) {
                    throw new NotFoundException(MESSAGES.ERROR.RETURN_ITEM_NOT_FOUND);
                }

                const requestedQuantity = Number(item.quantity);

                const alreadyReturned = invoiceItem.return_items.reduce(
                    (sum, returnItem) => sum + Number(returnItem.quantity),

                    0,
                );

                const availableQuantity = Number(invoiceItem.quantity) - alreadyReturned;

                if (requestedQuantity > availableQuantity) {
                    throw new ConflictException(MESSAGES.ERROR.INVALID_RETURN_QUANTITY);
                }

                const invoiceItemBatches = await this.returnsRepository.findInvoiceItemBatches(
                    invoiceItem.id,
                    tx,
                );

                const batches = this.prepareReturnBatches(
                    invoiceItemBatches,

                    requestedQuantity,
                );

                const allocatedQuantity = batches.reduce(
                    (sum, batch) => sum + batch.quantity,

                    0,
                );

                if (allocatedQuantity !== requestedQuantity) {
                    throw new ConflictException(MESSAGES.ERROR.INVALID_RETURN_QUANTITY);
                }

                const itemRefund = requestedQuantity * Number(invoiceItem.unit_price);

                refundAmount += itemRefund;

                preparedItems.push({
                    invoice_item_id: invoiceItem.id,

                    branch_product_id: invoiceItem.branch_product_id,

                    quantity: requestedQuantity,

                    refund_amount: itemRefund,

                    batches,
                });
            }

            const returnRecord = await this.returnsRepository.create(
                {
                    pharmacy: {
                        connect: {
                            id: pharmacyId,
                        },
                    },

                    branch: {
                        connect: {
                            id: branchId,
                        },
                    },

                    invoice: {
                        connect: {
                            id: invoice.id,
                        },
                    },

                    customer: {
                        connect: {
                            id: invoice.customer_id,
                        },
                    },

                    cashier: {
                        connect: {
                            id: user.id,
                        },
                    },

                    return_number: `RET-${Date.now()}`,

                    refund_amount: refundAmount,

                    reason: dto.reason,

                    notes: dto.notes,

                    items: {
                        create: preparedItems.map((item) => ({
                            invoice_item: {
                                connect: {
                                    id: item.invoice_item_id,
                                },
                            },

                            quantity: item.quantity,

                            refund_amount: item.refund_amount,
                        })),
                    },
                },

                tx,
            );

            for (const item of preparedItems) {
                for (const batch of item.batches) {
                    await this.returnsRepository.restoreBatchQuantity(
                        batch.product_batch_id,

                        batch.quantity,

                        tx,
                    );
                }
            }

            return returnRecord;
        });
    }

    private prepareReturnBatches(
        batches: {
            product_batch_id: string;

            quantity: unknown;
        }[],

        quantity: number,
    ): PreparedReturnBatch[] {
        let remaining = quantity;

        const result: PreparedReturnBatch[] = [];

        for (const batch of batches) {
            if (remaining <= 0) {
                break;
            }

            const restoreQuantity = Math.min(Number(batch.quantity), remaining);

            result.push({
                product_batch_id: batch.product_batch_id,

                quantity: restoreQuantity,
            });

            remaining -= restoreQuantity;
        }

        return result;
    }

    findMany(
        branchId: string,

        query: ReturnQueryDto,
    ) {
        return this.returnsRepository.findMany(
            branchId,

            query,
        );
    }

    async findById(id: string) {
        const record = await this.returnsRepository.findById(id);

        if (!record) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return record;
    }

    async cancel(id: string) {
        return this.prisma.$transaction(async (tx) => {
            const returnRecord = await this.returnsRepository.findByIdForCancel(id, tx);

            if (!returnRecord) {
                throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
            }

            if (returnRecord.status === ReturnStatus.CANCELLED) {
                throw new ConflictException(MESSAGES.ERROR.ALREADY_CANCELLED);
            }

            for (const item of returnRecord.items) {
                const batches = await this.returnsRepository.findInvoiceItemBatches(
                    item.invoice_item_id,
                    tx,
                );

                let remainingQuantity = Number(item.quantity);

                for (const batch of batches) {
                    if (remainingQuantity <= 0) {
                        break;
                    }

                    const decreaseQuantity = Math.min(Number(batch.quantity), remainingQuantity);

                    await this.returnsRepository.decreaseBatchQuantity(
                        batch.product_batch_id,

                        decreaseQuantity,

                        tx,
                    );

                    remainingQuantity -= decreaseQuantity;
                }

                if (remainingQuantity > 0) {
                    throw new ConflictException(MESSAGES.ERROR.INVALID_RETURN_QUANTITY);
                }
            }

            return this.returnsRepository.cancel(
                id,

                tx,
            );
        });
    }
}
