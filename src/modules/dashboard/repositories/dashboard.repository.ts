import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class DashboardRepository {
    constructor(private readonly prisma: PrismaService) {}

    async overview(branchId: string) {
        const todayStart = new Date();

        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();

        todayEnd.setHours(23, 59, 59, 999);

        const [
            todaySales,
            todayTransactions,
            totalProducts,
            lowStockProducts,
            expiringProducts,
            pendingPurchaseOrders,
            pendingHoldOrders,
            totalCustomers,
        ] = await Promise.all([
            this.getTodaySales(branchId, todayStart, todayEnd),

            this.getTodayTransactions(branchId, todayStart, todayEnd),

            this.getTotalProducts(branchId),

            this.getLowStockProducts(branchId),

            this.getExpiringProducts(branchId),

            this.getPendingPurchaseOrders(branchId),

            this.getPendingHoldOrders(branchId),

            this.getTotalCustomers(branchId),
        ]);

        return {
            today_sales: todaySales,

            today_transactions: todayTransactions,

            total_products: totalProducts,

            low_stock_products: lowStockProducts,

            expiring_products: expiringProducts,

            pending_purchase_orders: pendingPurchaseOrders,

            pending_hold_orders: pendingHoldOrders,

            total_customers: totalCustomers,
        };
    }

    private getTodaySales(branchId: string, start: Date, end: Date) {
        return this.prisma.invoice
            .aggregate({
                where: {
                    branch_id: branchId,

                    created_at: {
                        gte: start,
                        lte: end,
                    },

                    deleted_at: null,
                },

                _sum: {
                    grand_total: true,
                },
            })
            .then((result) => Number(result._sum.grand_total ?? 0));
    }

    private getTodayTransactions(branchId: string, start: Date, end: Date) {
        return this.prisma.invoice.count({
            where: {
                branch_id: branchId,

                created_at: {
                    gte: start,
                    lte: end,
                },

                deleted_at: null,
            },
        });
    }

    private getTotalProducts(branchId: string) {
        return this.prisma.branchProduct.count({
            where: {
                branch_id: branchId,

                deleted_at: null,
            },
        });
    }

    private getLowStockProducts(branchId: string) {
        return this.prisma.branchProduct.count({
            where: {
                branch_id: branchId,

                deleted_at: null,

                quantity: {
                    lte: 10,
                },
            },
        });
    }

    private getExpiringProducts(branchId: string) {
        const date = new Date();

        date.setDate(date.getDate() + 30);

        return this.prisma.productBatch.count({
            where: {
                branch_product: {
                    branch_id: branchId,
                },

                expiry_date: {
                    lte: date,
                    gte: new Date(),
                },

                deleted_at: null,
            },
        });
    }

    private getPendingPurchaseOrders(branchId: string) {
        return this.prisma.purchaseOrder.count({
            where: {
                branch_id: branchId,

                status: {
                    in: ['DRAFT', 'ACCEPTED', 'PARTIALLY_FULFILLED'],
                },

                deleted_at: null,
            },
        });
    }

    private getPendingHoldOrders(branchId: string) {
        return this.prisma.holdOrder.count({
            where: {
                branch_id: branchId,

                expires_at: {
                    gt: new Date(),
                },
            },
        });
    }

    private getTotalCustomers(branchId: string) {
        return this.prisma.customer.count({
            where: {
                invoices: {
                    some: {
                        branch_id: branchId,
                    },
                },

                deleted_at: null,
            },
        });
    }
}
