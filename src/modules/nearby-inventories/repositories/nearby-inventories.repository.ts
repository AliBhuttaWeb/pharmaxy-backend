import { Injectable } from '@nestjs/common';
import { PharmacyStatus, Prisma } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';
import { NearbyInventoriesQueryDto } from '../dtos';

@Injectable()
export class NearbyInventoriesRepository {
    constructor(private readonly prisma: PrismaService) {}

    private readonly relations: Prisma.BranchProductInclude = {
        branch: {
            select: {
                id: true,
                name: true,
                address: true,
                city: true,
                state: true,
                country: true,
                postal_code: true,
                latitude: true,
                longitude: true,
                phone: true,
                email: true,
                pharmacy: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                        logo_url: true,
                    },
                },
            },
        },
        product: {
            select: {
                id: true,
                name: true,
                generic_name: true,
                strength: true,
                pack_quantity: true,
                barcode: true,
                requires_prescription: true,
                manufacturer: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                dosage_form: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        },
    };

    findBranchCoordinates(branchId: string) {
        return this.prisma.branch.findFirst({
            where: {
                id: branchId,
                deleted_at: null,
            },
            select: {
                id: true,
                pharmacy_id: true,
                latitude: true,
                longitude: true,
                city: true,
                settings: {
                    select: {
                        search_radius: true,
                        radius_unit: true,
                    },
                },
            },
        });
    }

    findStoreById(branchId: string) {
        return this.prisma.branch.findFirst({
            where: {
                id: branchId,
                deleted_at: null,
                is_active: true,
                pharmacy: {
                    deleted_at: null,
                    status: PharmacyStatus.ACTIVE,
                },
            },
            select: {
                id: true,
                name: true,
                address: true,
                city: true,
                state: true,
                country: true,
                postal_code: true,
                latitude: true,
                longitude: true,
                phone: true,
                email: true,
                pharmacy: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                        logo_url: true,
                    },
                },
            },
        });
    }

    findAvailableAcrossBranches(query: NearbyInventoriesQueryDto, excludeBranchId?: string) {
        const { search, product_id, generic_name, dosage_form_id, category_id, city } = query;

        const where: Prisma.BranchProductWhereInput = {
            deleted_at: null,
            is_active: true,
            quantity: {
                gt: 0,
            },
            ...(excludeBranchId && {
                branch_id: {
                    not: excludeBranchId,
                },
            }),
            ...(product_id && {
                product_id,
            }),
            branch: {
                deleted_at: null,
                is_active: true,
                ...(city && {
                    city: {
                        contains: city,
                        mode: 'insensitive',
                    },
                }),
                pharmacy: {
                    deleted_at: null,
                    status: PharmacyStatus.ACTIVE,
                },
            },
            product: {
                deleted_at: null,
                is_active: true,
                ...(generic_name && {
                    generic_name: {
                        contains: generic_name,
                        mode: 'insensitive',
                    },
                }),
                ...(dosage_form_id && {
                    dosage_form_id,
                }),
                ...(category_id && {
                    category_id,
                }),
                ...(search && {
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            generic_name: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            barcode: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    ],
                }),
            },
        };

        return this.prisma.branchProduct.findMany({
            where,
            orderBy: {
                quantity: 'desc',
            },
            include: this.relations,
        });
    }

    findTargetBranchProductById(id: string, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).branchProduct.findFirst({
            where: {
                id,
                deleted_at: null,
                is_active: true,
                branch: {
                    deleted_at: null,
                    is_active: true,
                    pharmacy: {
                        deleted_at: null,
                        status: PharmacyStatus.ACTIVE,
                    },
                },
                product: {
                    deleted_at: null,
                    is_active: true,
                },
            },
            include: this.relations,
        });
    }

    decrementBranchProductStock(id: string, quantity: number, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).branchProduct.update({
            where: { id },
            data: {
                quantity: {
                    decrement: quantity,
                },
            },
        });
    }

    incrementBranchProductStock(id: string, quantity: number, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).branchProduct.update({
            where: { id },
            data: {
                quantity: {
                    increment: quantity,
                },
            },
        });
    }

    findAvailableBatchForReservation(
        branchProductId: string,
        requiredQuantity: number,
        productBatchId?: string,
        tx?: Prisma.TransactionClient,
    ) {
        return this.prisma.getClient(tx).productBatch.findFirst({
            where: {
                branch_product_id: branchProductId,
                deleted_at: null,
                ...(productBatchId && { id: productBatchId }),
                quantity: {
                    gte: requiredQuantity,
                },
                OR: [{ expiry_date: null }, { expiry_date: { gt: new Date() } }],
            },
            orderBy: [{ expiry_date: 'asc' }, { created_at: 'asc' }],
        });
    }

    decrementBatchStock(id: string, quantity: number, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).productBatch.update({
            where: { id },
            data: {
                quantity: {
                    decrement: quantity,
                },
            },
        });
    }

    incrementBatchStock(id: string, quantity: number, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).productBatch.update({
            where: { id },
            data: {
                quantity: {
                    increment: quantity,
                },
            },
        });
    }
}
