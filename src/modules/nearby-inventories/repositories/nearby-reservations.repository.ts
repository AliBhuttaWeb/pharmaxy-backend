import { Injectable } from '@nestjs/common';
import { NearbyReservationStatus, Prisma } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';
import { RESERVATION_DIRECTION } from '../constants';
import { NearbyReservationsQueryDto } from '../dtos';

@Injectable()
export class NearbyReservationsRepository {
    constructor(private readonly prisma: PrismaService) {}

    private readonly relations: Prisma.NearbyReservationInclude = {
        requesting_branch: {
            select: {
                id: true,
                name: true,
                address: true,
                city: true,
                phone: true,
                email: true,
                pharmacy: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                    },
                },
            },
        },
        target_branch: {
            select: {
                id: true,
                name: true,
                address: true,
                city: true,
                phone: true,
                email: true,
                pharmacy: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                    },
                },
            },
        },
        branch_product: {
            select: {
                id: true,
                quantity: true,
                selling_price: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        generic_name: true,
                        strength: true,
                        pack_quantity: true,
                        barcode: true,
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
            },
        },
        branch_product_batch: {
            select: {
                id: true,
                batch_number: true,
                expiry_date: true,
                mrp: true,
                purchase_price: true,
                quantity: true,
            },
        },
    };

    create(data: Prisma.NearbyReservationCreateInput, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).nearbyReservation.create({
            data,
            include: this.relations,
        });
    }

    findById(id: string, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).nearbyReservation.findFirst({
            where: {
                id,
                deleted_at: null,
            },
            include: this.relations,
        });
    }

    findExpiredActiveReservations(now: Date, branchId?: string) {
        return this.prisma.nearbyReservation.findMany({
            where: {
                deleted_at: null,
                status: {
                    in: [NearbyReservationStatus.PENDING, NearbyReservationStatus.CONFIRMED],
                },
                expires_at: {
                    lte: now,
                },
                ...(branchId && {
                    OR: [{ requesting_branch_id: branchId }, { target_branch_id: branchId }],
                }),
            },
            select: {
                id: true,
                branch_product_id: true,
                branch_product_batch_id: true,
                quantity: true,
            },
        });
    }

    markExpired(id: string, tx?: Prisma.TransactionClient) {
        return this.prisma.getClient(tx).nearbyReservation.update({
            where: { id },
            data: {
                status: NearbyReservationStatus.EXPIRED,
            },
        });
    }

    updateStatus(
        id: string,
        data: Prisma.NearbyReservationUpdateInput,
        tx?: Prisma.TransactionClient,
    ) {
        return this.prisma.getClient(tx).nearbyReservation.update({
            where: { id },
            data,
            include: this.relations,
        });
    }

    async findMany(query: NearbyReservationsQueryDto, currentBranchId?: string) {
        const {
            page,
            limit,
            search,
            sort_by,
            sort_order,
            direction = RESERVATION_DIRECTION.ALL,
            status,
            branch_product_id,
            requesting_branch_id,
            target_branch_id,
        } = query;

        const andConditions: Prisma.NearbyReservationWhereInput[] = [{ deleted_at: null }];

        if (currentBranchId) {
            if (direction === RESERVATION_DIRECTION.OUTGOING) {
                andConditions.push({ requesting_branch_id: currentBranchId });
            } else if (direction === RESERVATION_DIRECTION.INCOMING) {
                andConditions.push({ target_branch_id: currentBranchId });
            } else {
                andConditions.push({
                    OR: [
                        { requesting_branch_id: currentBranchId },
                        { target_branch_id: currentBranchId },
                    ],
                });
            }
        }

        if (requesting_branch_id) {
            andConditions.push({ requesting_branch_id });
        }

        if (target_branch_id) {
            andConditions.push({ target_branch_id });
        }

        if (status) {
            andConditions.push({ status });
        }

        if (branch_product_id) {
            andConditions.push({ branch_product_id });
        }

        if (search) {
            andConditions.push({
                OR: [
                    {
                        reservation_number: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        customer_name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        customer_phone: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        branch_product: {
                            product: {
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
                                ],
                            },
                        },
                    },
                    {
                        requesting_branch: {
                            name: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    },
                    {
                        target_branch: {
                            name: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    },
                ],
            });
        }

        const where: Prisma.NearbyReservationWhereInput = { AND: andConditions };

        const sortableFields = [
            'created_at',
            'expires_at',
            'quantity',
            'status',
            'reservation_number',
        ] as const;

        type SortableField = (typeof sortableFields)[number];

        const field: SortableField =
            sort_by && sortableFields.includes(sort_by as SortableField)
                ? (sort_by as SortableField)
                : 'created_at';

        const orderBy: Prisma.NearbyReservationOrderByWithRelationInput = {
            [field]: sort_order ?? 'desc',
        };

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            const records = await this.prisma.nearbyReservation.findMany({
                where,
                orderBy,
                include: this.relations,
            });
            return { records };
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.nearbyReservation.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
                include: this.relations,
            }),
            this.prisma.nearbyReservation.count({
                where,
            }),
        ]);

        return {
            records,
            total,
        };
    }
}
