import { Injectable } from '@nestjs/common';

import { InvoiceStatus, PaymentStatus, PurchaseOrderStatus, ReturnStatus } from '@gen/prisma/enums';
import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class DashboardRepository {
    constructor(private readonly prisma: PrismaService) {}

    async overview(branchId: string, days: number = 7) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const [
            todaySales,
            todayTransactions,
            todayReturnedItems,
            todayReturns,
            todayRefundAmount,
            totalProducts,
            lowStockProducts,
            expiringProducts,
            pendingPurchaseOrders,
            awaitingDeliveryPurchaseOrders,
            pendingHoldOrders,
            totalCustomers,
            salesTrend,
            topSellingProducts,
            paymentMethods,
        ] = await Promise.all([
            this.getTodaySales(branchId, todayStart, todayEnd),
            this.getTodayTransactions(branchId, todayStart, todayEnd),
            this.getTodayReturnedItems(branchId, todayStart, todayEnd),
            this.getTodayReturns(branchId, todayStart, todayEnd),
            this.getTodayRefundAmount(branchId, todayStart, todayEnd),
            this.getTotalProducts(branchId),
            this.getLowStockProducts(branchId),
            this.getExpiringProducts(branchId),
            this.getPendingPurchaseOrders(branchId),
            this.getAwaitingDeliveryPurchaseOrders(branchId),
            this.getPendingHoldOrders(branchId),
            this.getTotalCustomers(branchId),
            this.getSalesTrend(branchId, days),
            this.getTopSellingProducts(branchId, 5),
            this.getPaymentMethodsBreakdown(branchId),
        ]);

        return {
            today_sales: todaySales,
            today_transactions: todayTransactions,
            today_returned_items: todayReturnedItems,
            today_returns: todayReturns,
            today_refund_amount: todayRefundAmount,
            total_products: totalProducts,
            low_stock_products: lowStockProducts,
            expiring_products: expiringProducts,
            pending_purchase_orders: pendingPurchaseOrders,
            awaiting_delivery_purchase_orders: awaitingDeliveryPurchaseOrders,
            pending_hold_orders: pendingHoldOrders,
            total_customers: totalCustomers,
            sales_trend: salesTrend,
            top_selling_products: topSellingProducts,
            payment_methods: paymentMethods,
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
                    status: {
                        not: InvoiceStatus.CANCELLED,
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
                status: {
                    not: InvoiceStatus.CANCELLED,
                },
                deleted_at: null,
            },
        });
    }

    private getTodayReturnedItems(branchId: string, start: Date, end: Date) {
        return this.prisma.returnItem
            .aggregate({
                where: {
                    return: {
                        branch_id: branchId,
                        status: ReturnStatus.COMPLETED,
                        created_at: {
                            gte: start,
                            lte: end,
                        },
                    },
                },
                _sum: {
                    quantity: true,
                },
            })
            .then((result) => Number(result._sum.quantity ?? 0));
    }

    private getTodayReturns(branchId: string, start: Date, end: Date) {
        return this.prisma.return.count({
            where: {
                branch_id: branchId,
                status: ReturnStatus.COMPLETED,
                created_at: {
                    gte: start,
                    lte: end,
                },
            },
        });
    }

    private getTodayRefundAmount(branchId: string, start: Date, end: Date) {
        return this.prisma.return
            .aggregate({
                where: {
                    branch_id: branchId,
                    status: ReturnStatus.COMPLETED,
                    created_at: {
                        gte: start,
                        lte: end,
                    },
                },
                _sum: {
                    refund_amount: true,
                },
            })
            .then((result) => Number(Number(result._sum.refund_amount ?? 0).toFixed(2)));
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
                    in: [PurchaseOrderStatus.DRAFT, PurchaseOrderStatus.PENDING_SUPPLIER],
                },
                deleted_at: null,
            },
        });
    }

    private getAwaitingDeliveryPurchaseOrders(branchId: string) {
        return this.prisma.purchaseOrder.count({
            where: {
                branch_id: branchId,
                status: {
                    in: [PurchaseOrderStatus.ACCEPTED, PurchaseOrderStatus.PARTIALLY_FULFILLED],
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

    private async getSalesTrend(branchId: string, days: number = 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (days - 1));
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        const invoices = await this.prisma.invoice.findMany({
            where: {
                branch_id: branchId,
                created_at: {
                    gte: startDate,
                    lte: endDate,
                },
                deleted_at: null,
                status: {
                    not: InvoiceStatus.CANCELLED,
                },
            },
            select: {
                created_at: true,
                grand_total: true,
            },
        });

        const trendMap = new Map<string, { date: string; sales: number; transactions: number }>();
        for (let i = 0; i < days; i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            const key = d.toISOString().split('T')[0];
            trendMap.set(key, { date: key, sales: 0, transactions: 0 });
        }

        for (const invoice of invoices) {
            const key = invoice.created_at.toISOString().split('T')[0];
            const entry = trendMap.get(key);
            if (entry) {
                entry.sales = Number((entry.sales + Number(invoice.grand_total)).toFixed(2));
                entry.transactions += 1;
            }
        }

        return Array.from(trendMap.values());
    }

    private async getTopSellingProducts(branchId: string, limit: number = 5) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        const items = await this.prisma.invoiceItem.findMany({
            where: {
                invoice: {
                    branch_id: branchId,
                    deleted_at: null,
                    status: {
                        not: InvoiceStatus.CANCELLED,
                    },
                    created_at: {
                        gte: thirtyDaysAgo,
                    },
                },
            },
            select: {
                product_id: true,
                quantity: true,
                line_total: true,
                product: {
                    select: {
                        name: true,
                        generic_name: true,
                    },
                },
            },
        });

        const productMap = new Map<
            string,
            {
                product_id: string;
                name: string;
                generic_name: string | null;
                quantity_sold: number;
                total_revenue: number;
            }
        >();

        for (const item of items) {
            const current = productMap.get(item.product_id) || {
                product_id: item.product_id,
                name: item.product?.name ?? 'Unknown Product',
                generic_name: item.product?.generic_name ?? null,
                quantity_sold: 0,
                total_revenue: 0,
            };
            current.quantity_sold += item.quantity;
            current.total_revenue = Number((current.total_revenue + Number(item.line_total)).toFixed(2));
            productMap.set(item.product_id, current);
        }

        return Array.from(productMap.values())
            .sort((a, b) => b.quantity_sold - a.quantity_sold)
            .slice(0, limit);
    }

    private async getPaymentMethodsBreakdown(branchId: string) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        const payments = await this.prisma.invoicePayment.findMany({
            where: {
                invoice: {
                    branch_id: branchId,
                    deleted_at: null,
                    status: {
                        not: InvoiceStatus.CANCELLED,
                    },
                    created_at: {
                        gte: thirtyDaysAgo,
                    },
                },
                status: PaymentStatus.SUCCESS,
            },
            include: {
                pharmacy_payment_method: {
                    include: {
                        payment_method: {
                            select: {
                                name: true,
                                code: true,
                            },
                        },
                    },
                },
            },
        });

        const paymentMap = new Map<
            string,
            {
                method: string;
                code: string;
                amount: number;
                transaction_count: number;
            }
        >();

        for (const payment of payments) {
            const code = payment.pharmacy_payment_method?.payment_method?.code ?? 'UNKNOWN';
            const name = payment.pharmacy_payment_method?.payment_method?.name ?? 'Unknown';

            const current = paymentMap.get(code) || {
                method: name,
                code,
                amount: 0,
                transaction_count: 0,
            };
            current.amount = Number((current.amount + Number(payment.amount)).toFixed(2));
            current.transaction_count += 1;
            paymentMap.set(code, current);
        }

        return Array.from(paymentMap.values());
    }
}
