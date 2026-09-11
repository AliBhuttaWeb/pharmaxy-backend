import { Injectable } from '@nestjs/common';
import { Prisma } from '@gen/prisma/client';
import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class SettingsRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findByBranchId(branchId: string) {
        return this.prisma.branchSettings.findUnique({
            where: { branch_id: branchId },
        });
    }

    async createDefault(branchId: string) {
        return this.prisma.branchSettings.create({
            data: {
                branch: {
                    connect: { id: branchId },
                },
            },
        });
    }

    async upsert(branchId: string, data: Prisma.BranchSettingsUpdateInput) {
        const createData: Prisma.BranchSettingsCreateInput = {
            branch: {
                connect: { id: branchId },
            },
            ...(data.timezone !== undefined && { timezone: data.timezone as string }),
            ...(data.currency !== undefined && { currency: data.currency as string }),
            ...(data.receipt_header !== undefined && { receipt_header: data.receipt_header as string }),
            ...(data.receipt_footer !== undefined && { receipt_footer: data.receipt_footer as string }),
            ...(data.print_logo !== undefined && { print_logo: data.print_logo as boolean }),
            ...(data.print_tax_number !== undefined && { print_tax_number: data.print_tax_number as boolean }),
            ...(data.print_phone !== undefined && { print_phone: data.print_phone as boolean }),
            ...(data.print_address !== undefined && { print_address: data.print_address as boolean }),
            ...(data.print_qr_code !== undefined && { print_qr_code: data.print_qr_code as boolean }),
            ...(data.show_cashier_name !== undefined && { show_cashier_name: data.show_cashier_name as boolean }),
            ...(data.minimum_stock_quantity !== undefined && { minimum_stock_quantity: data.minimum_stock_quantity as number }),
            ...(data.critical_stock_quantity !== undefined && { critical_stock_quantity: data.critical_stock_quantity as number }),
            ...(data.expiry_alert_before_days !== undefined && { expiry_alert_before_days: data.expiry_alert_before_days as number }),
            ...(data.enable_stock_sharing !== undefined && { enable_stock_sharing: data.enable_stock_sharing as boolean }),
            ...(data.share_inventory_details !== undefined && { share_inventory_details: data.share_inventory_details as boolean }),
            ...(data.allow_reservations !== undefined && { allow_reservations: data.allow_reservations as boolean }),
            ...(data.search_radius !== undefined && { search_radius: data.search_radius as any }),
            ...(data.radius_unit !== undefined && { radius_unit: data.radius_unit as any }),
            ...(data.email_notifications !== undefined && { email_notifications: data.email_notifications as boolean }),
            ...(data.sms_notifications !== undefined && { sms_notifications: data.sms_notifications as boolean }),
            ...(data.push_notifications !== undefined && { push_notifications: data.push_notifications as boolean }),
            ...(data.in_app_notifications !== undefined && { in_app_notifications: data.in_app_notifications as boolean }),
            ...(data.low_stock_alert !== undefined && { low_stock_alert: data.low_stock_alert as boolean }),
            ...(data.expiry_alert !== undefined && { expiry_alert: data.expiry_alert as boolean }),
            ...(data.purchase_alert !== undefined && { purchase_alert: data.purchase_alert as boolean }),
            ...(data.sale_alert !== undefined && { sale_alert: data.sale_alert as boolean }),
        };

        return this.prisma.branchSettings.upsert({
            where: { branch_id: branchId },
            create: createData,
            update: data,
        });
    }
}
