import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { NearbyReservationStatus } from '@gen/prisma/enums';

import { PrismaService } from '@/database/prisma/prisma.service';
import { buildPaginationMeta } from '@/common/pagination';
import { getActiveBranchId, isSuperAdmin } from '@/common/helpers';
import { AuthenticatedUser } from '@/modules/auth/types';

import {
    MESSAGES,
    NEARBY_INVENTORY_DEFAULTS,
    RESERVATION_DIRECTION,
} from '../constants';
import {
    CreateNearbyReservationDto,
    NearbyInventoriesQueryDto,
    NearbyReservationsQueryDto,
    UpdateNearbyReservationStatusDto,
} from '../dtos';
import { calculateDistanceKm } from '../helpers/calculate-distance.helper';
import { generateReservationNumber } from '../helpers/generate-reservation-number.helper';
import { NearbyInventoriesRepository } from '../repositories/nearby-inventories.repository';
import { NearbyReservationsRepository } from '../repositories/nearby-reservations.repository';

@Injectable()
export class NearbyInventoriesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly nearbyInventoriesRepository: NearbyInventoriesRepository,
        private readonly nearbyReservationsRepository: NearbyReservationsRepository,
    ) {}

    /**
     * Automatically expires overdue PENDING/CONFIRMED reservations and restores held stock back to the target branch.
     */
    private async releaseExpiredReservations(branchId?: string): Promise<void> {
        const now = new Date();
        const expired = await this.nearbyReservationsRepository.findExpiredActiveReservations(
            now,
            branchId,
        );

        if (!expired.length) {
            return;
        }

        await this.prisma.$transaction(async (tx) => {
            for (const item of expired) {
                await this.nearbyReservationsRepository.markExpired(item.id, tx);
                await this.nearbyInventoriesRepository.incrementBranchProductStock(
                    item.branch_product_id,
                    item.quantity,
                    tx,
                );
                if (item.product_batch_id) {
                    await this.nearbyInventoriesRepository.incrementBatchStock(
                        item.product_batch_id,
                        item.quantity,
                        tx,
                    );
                }
            }
        });
    }

    async search(query: NearbyInventoriesQueryDto, user: AuthenticatedUser) {
        const currentBranchId = user.branch_id ?? undefined;

        await this.releaseExpiredReservations();

        let originLat = query.latitude;
        let originLon = query.longitude;

        if ((originLat === undefined || originLon === undefined) && currentBranchId) {
            const currentBranch =
                await this.nearbyInventoriesRepository.findBranchCoordinates(currentBranchId);

            if (currentBranch) {
                if (originLat === undefined && currentBranch.latitude !== null) {
                    originLat = Number(currentBranch.latitude);
                }
                if (originLon === undefined && currentBranch.longitude !== null) {
                    originLon = Number(currentBranch.longitude);
                }
            }
        }

        const rawRecords = await this.nearbyInventoriesRepository.findAvailableAcrossBranches(
            query,
            currentBranchId,
        );

        const hasOriginCoordinates = originLat !== undefined && originLon !== undefined;

        let enrichedRecords = rawRecords.map((record) => {
            const branchLat =
                record.branch.latitude !== null ? Number(record.branch.latitude) : null;
            const branchLon =
                record.branch.longitude !== null ? Number(record.branch.longitude) : null;

            const distance_km =
                hasOriginCoordinates && branchLat !== null && branchLon !== null
                    ? calculateDistanceKm(originLat!, originLon!, branchLat, branchLon)
                    : null;

            return {
                ...record,
                distance_km,
            };
        });

        if (query.radius !== undefined && hasOriginCoordinates) {
            enrichedRecords = enrichedRecords.filter(
                (item) => item.distance_km !== null && item.distance_km <= query.radius!,
            );
        }

        if (hasOriginCoordinates) {
            enrichedRecords.sort((a, b) => {
                if (a.distance_km !== null && b.distance_km !== null) {
                    return a.distance_km - b.distance_km;
                }
                if (a.distance_km !== null) return -1;
                if (b.distance_km !== null) return 1;
                return b.quantity - a.quantity;
            });
        }

        const { page, limit } = query;
        const total = enrichedRecords.length;

        if (!page || !limit) {
            return { records: enrichedRecords };
        }

        const start = (page - 1) * limit;
        const records = enrichedRecords.slice(start, start + limit);
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });

        return { records, pagination };
    }

    async getStore(branchId: string, query: NearbyInventoriesQueryDto, user: AuthenticatedUser) {
        await this.releaseExpiredReservations(branchId);

        const store = await this.nearbyInventoriesRepository.findStoreById(branchId);
        if (!store) {
            throw new NotFoundException(MESSAGES.ERROR.STORE_NOT_FOUND);
        }

        let distance_km: number | null = null;
        if (user.branch_id && store.latitude !== null && store.longitude !== null) {
            const callerBranch = await this.nearbyInventoriesRepository.findBranchCoordinates(
                user.branch_id,
            );
            if (
                callerBranch &&
                callerBranch.latitude !== null &&
                callerBranch.longitude !== null
            ) {
                distance_km = calculateDistanceKm(
                    Number(callerBranch.latitude),
                    Number(callerBranch.longitude),
                    Number(store.latitude),
                    Number(store.longitude),
                );
            }
        }

        const allBranchItems = await this.nearbyInventoriesRepository.findAvailableAcrossBranches(
            query,
        );
        const storeItems = allBranchItems.filter((item) => item.branch_id === branchId);

        const { page, limit } = query;
        if (!page || !limit) {
            return {
                store: { ...store, distance_km },
                records: storeItems,
            };
        }

        const total = storeItems.length;
        const start = (page - 1) * limit;
        const records = storeItems.slice(start, start + limit);
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });

        return {
            store: { ...store, distance_km },
            records,
            pagination,
        };
    }

    async reserve(dto: CreateNearbyReservationDto, user: AuthenticatedUser) {
        const requestingBranchId = getActiveBranchId(user);

        await this.releaseExpiredReservations();

        const requestingBranch =
            await this.nearbyInventoriesRepository.findBranchCoordinates(requestingBranchId);
        if (!requestingBranch) {
            throw new NotFoundException(MESSAGES.ERROR.STORE_NOT_FOUND);
        }

        const now = new Date();
        const expiresAt = dto.expires_at
            ? new Date(dto.expires_at)
            : new Date(
                  now.getTime() +
                      (dto.expires_in_minutes ??
                          NEARBY_INVENTORY_DEFAULTS.RESERVATION_EXPIRY_MINUTES) *
                          60 *
                          1000,
              );

        if (expiresAt <= now) {
            throw new BadRequestException(MESSAGES.ERROR.INVALID_EXPIRY_TIME);
        }

        const reservation = await this.prisma.$transaction(async (tx) => {
            const targetBranchProduct =
                await this.nearbyInventoriesRepository.findTargetBranchProductById(
                    dto.branch_product_id,
                    tx,
                );

            if (!targetBranchProduct) {
                throw new NotFoundException(MESSAGES.ERROR.BRANCH_PRODUCT_NOT_FOUND);
            }

            if (targetBranchProduct.branch_id === requestingBranchId) {
                throw new ConflictException(MESSAGES.ERROR.CANNOT_RESERVE_FROM_OWN_BRANCH);
            }

            if (targetBranchProduct.quantity < dto.quantity) {
                throw new ConflictException(MESSAGES.ERROR.INSUFFICIENT_STOCK);
            }

            const targetBatch =
                await this.nearbyInventoriesRepository.findAvailableBatchForReservation(
                    targetBranchProduct.id,
                    dto.quantity,
                    dto.product_batch_id,
                    tx,
                );

            if (dto.product_batch_id && !targetBatch) {
                throw new NotFoundException(MESSAGES.ERROR.PRODUCT_BATCH_NOT_FOUND);
            }

            await this.nearbyInventoriesRepository.decrementBranchProductStock(
                targetBranchProduct.id,
                dto.quantity,
                tx,
            );

            if (targetBatch) {
                await this.nearbyInventoriesRepository.decrementBatchStock(
                    targetBatch.id,
                    dto.quantity,
                    tx,
                );
            }

            return this.nearbyReservationsRepository.create(
                {
                    reservation_number: generateReservationNumber(),
                    requesting_branch: {
                        connect: { id: requestingBranchId },
                    },
                    target_branch: {
                        connect: { id: targetBranchProduct.branch_id },
                    },
                    branch_product: {
                        connect: { id: targetBranchProduct.id },
                    },
                    ...(targetBatch && {
                        product_batch: {
                            connect: { id: targetBatch.id },
                        },
                    }),
                    quantity: dto.quantity,
                    customer_name: dto.customer_name,
                    customer_phone: dto.customer_phone,
                    notes: dto.notes,
                    expires_at: expiresAt,
                },
                tx,
            );
        });

        return {
            reservation,
            message: MESSAGES.SUCCESS.RESERVED,
        };
    }

    async listReservations(query: NearbyReservationsQueryDto, user: AuthenticatedUser) {
        const isUserSuperAdmin = isSuperAdmin(user.roles);
        const currentBranchId =
            isUserSuperAdmin && !user.branch_id ? undefined : getActiveBranchId(user);

        await this.releaseExpiredReservations(currentBranchId);

        const { page, limit } = query;
        const { records: rawRecords, total } = await this.nearbyReservationsRepository.findMany(
            query,
            currentBranchId,
        );

        const records = rawRecords.map((record) => ({
            ...record,
            reservation_type:
                currentBranchId && record.requesting_branch_id === currentBranchId
                    ? RESERVATION_DIRECTION.OUTGOING
                    : currentBranchId && record.target_branch_id === currentBranchId
                      ? RESERVATION_DIRECTION.INCOMING
                      : undefined,
        }));

        if (!total || !page || !limit) {
            return { records };
        }

        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });

        return { records, pagination };
    }

    async getReservation(id: string, user: AuthenticatedUser) {
        const isUserSuperAdmin = isSuperAdmin(user.roles);
        const currentBranchId =
            isUserSuperAdmin && !user.branch_id ? undefined : getActiveBranchId(user);

        await this.releaseExpiredReservations(currentBranchId);

        const reservation = await this.nearbyReservationsRepository.findById(id);
        if (!reservation) {
            throw new NotFoundException(MESSAGES.ERROR.RESERVATION_NOT_FOUND);
        }

        if (
            !isUserSuperAdmin &&
            reservation.requesting_branch_id !== currentBranchId &&
            reservation.target_branch_id !== currentBranchId
        ) {
            throw new ForbiddenException(MESSAGES.ERROR.RESERVATION_ACCESS_DENIED);
        }

        return {
            reservation: {
                ...reservation,
                reservation_type:
                    currentBranchId && reservation.requesting_branch_id === currentBranchId
                        ? RESERVATION_DIRECTION.OUTGOING
                        : currentBranchId && reservation.target_branch_id === currentBranchId
                          ? RESERVATION_DIRECTION.INCOMING
                          : undefined,
            },
        };
    }

    async updateReservationStatus(
        id: string,
        dto: UpdateNearbyReservationStatusDto,
        user: AuthenticatedUser,
    ) {
        const isUserSuperAdmin = isSuperAdmin(user.roles);
        const currentBranchId =
            isUserSuperAdmin && !user.branch_id ? undefined : getActiveBranchId(user);

        await this.releaseExpiredReservations(currentBranchId);

        const existing = await this.nearbyReservationsRepository.findById(id);
        if (!existing) {
            throw new NotFoundException(MESSAGES.ERROR.RESERVATION_NOT_FOUND);
        }

        if (
            !isUserSuperAdmin &&
            existing.requesting_branch_id !== currentBranchId &&
            existing.target_branch_id !== currentBranchId
        ) {
            throw new ForbiddenException(MESSAGES.ERROR.RESERVATION_ACCESS_DENIED);
        }

        if (
            existing.status === NearbyReservationStatus.COMPLETED ||
            existing.status === NearbyReservationStatus.CANCELLED ||
            existing.status === NearbyReservationStatus.EXPIRED
        ) {
            throw new ConflictException(MESSAGES.ERROR.RESERVATION_ALREADY_FINALIZED);
        }

        if (
            (dto.status === NearbyReservationStatus.CONFIRMED ||
                dto.status === NearbyReservationStatus.COMPLETED) &&
            !isUserSuperAdmin &&
            existing.target_branch_id !== currentBranchId
        ) {
            throw new ForbiddenException(MESSAGES.ERROR.ONLY_TARGET_BRANCH_CAN_CONFIRM_OR_COMPLETE);
        }

        const now = new Date();

        const reservation = await this.prisma.$transaction(async (tx) => {
            if (
                dto.status === NearbyReservationStatus.CANCELLED ||
                dto.status === NearbyReservationStatus.EXPIRED
            ) {
                await this.nearbyInventoriesRepository.incrementBranchProductStock(
                    existing.branch_product_id,
                    existing.quantity,
                    tx,
                );
                if (existing.product_batch_id) {
                    await this.nearbyInventoriesRepository.incrementBatchStock(
                        existing.product_batch_id,
                        existing.quantity,
                        tx,
                    );
                }
            }

            return this.nearbyReservationsRepository.updateStatus(
                id,
                {
                    status: dto.status,
                    ...(dto.notes !== undefined && { notes: dto.notes }),
                    responded_at: existing.responded_at ?? now,
                    ...(dto.status === NearbyReservationStatus.COMPLETED && {
                        completed_at: now,
                    }),
                    ...(dto.status === NearbyReservationStatus.CANCELLED && {
                        cancelled_at: now,
                    }),
                },
                tx,
            );
        });

        return {
            reservation,
            message: MESSAGES.SUCCESS.RESERVATION_STATUS_UPDATED,
        };
    }
}
