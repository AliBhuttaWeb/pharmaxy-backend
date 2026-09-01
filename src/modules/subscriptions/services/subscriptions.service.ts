import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { Prisma, SubscriptionStatus } from '@gen/prisma/client';

import { addDays, addMonths, addYears } from 'date-fns';

import {
    AssignSubscriptionDto,
    CancelSubscriptionDto,
    RenewSubscriptionDto,
    SubscriptionQueryDto,
    UpdateSubscriptionDto,
} from '../dtos';

import { MESSAGES } from '../constants';

import { SubscriptionsRepository } from '../repositories/subscriptions.repository';

import { SubscriptionPlansService } from '@/modules/subscription-plans/services/subscription-plans.service';
import { buildPaginationMeta } from '@/common/pagination';

@Injectable()
export class SubscriptionsService {
    constructor(
        private readonly subscriptionsRepository: SubscriptionsRepository,
        private readonly subscriptionPlansService: SubscriptionPlansService,
    ) {}

    async findMany(query: SubscriptionQueryDto) {
        const { limit, page } = query;
        const { records, total } = await this.subscriptionsRepository.findMany(query);
        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
        return { records, pagination };
    }

    async findById(id: string) {
        const subscription = await this.subscriptionsRepository.findById(id);

        if (!subscription) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return subscription;
    }

    async assign(dto: AssignSubscriptionDto) {
        const active = await this.subscriptionsRepository.findActiveByPharmacyId(dto.pharmacy_id);

        if (active) {
            throw new ConflictException(MESSAGES.ERROR.ACTIVE_SUBSCRIPTION_ALREADY_EXISTS);
        }

        const plan = await this.subscriptionPlansService.findById(dto.subscription_plan_id);

        const startedAt = dto.started_at ? new Date(dto.started_at) : new Date();

        const expiresAt =
            plan.billing_cycle === 'MONTHLY' ? addMonths(startedAt, 1) : addYears(startedAt, 1);

        const data: Prisma.SubscriptionCreateInput = {
            pharmacy: {
                connect: {
                    id: dto.pharmacy_id,
                },
            },

            plan: {
                connect: {
                    id: dto.subscription_plan_id,
                },
            },

            status: plan.trial_days > 0 ? SubscriptionStatus.TRIAL : SubscriptionStatus.ACTIVE,

            started_at: startedAt,

            expires_at: expiresAt,

            trial_started_at: plan.trial_days > 0 ? startedAt : undefined,

            trial_expires_at: plan.trial_days > 0 ? addDays(startedAt, plan.trial_days) : undefined,

            auto_renew: dto.auto_renew ?? true,
        };

        return this.subscriptionsRepository.create(data);
    }

    async update(id: string, dto: UpdateSubscriptionDto) {
        await this.findById(id);

        const data: Prisma.SubscriptionUpdateInput = {
            ...(dto.auto_renew !== undefined && {
                auto_renew: dto.auto_renew,
            }),
        };

        return this.subscriptionsRepository.update(id, data);
    }

    async cancel(id: string, dto: CancelSubscriptionDto) {
        await this.findById(id);

        return this.subscriptionsRepository.update(id, {
            status: SubscriptionStatus.CANCELLED,

            cancelled_at: new Date(),

            cancellation_reason: dto.cancellation_reason,
        });
    }

    async renew(id: string, dto: RenewSubscriptionDto) {
        const subscription = await this.findById(id);

        const expiresAt =
            subscription.plan.billing_cycle === 'MONTHLY'
                ? addMonths(subscription.expires_at, 1)
                : addYears(subscription.expires_at, 1);

        return this.subscriptionsRepository.update(id, {
            status: SubscriptionStatus.ACTIVE,

            expires_at: expiresAt,

            auto_renew: dto.auto_renew ?? subscription.auto_renew,
        });
    }

    async findActiveByPharmacyId(pharmacyId: string) {
        const subscription = await this.subscriptionsRepository.findActiveByPharmacyId(pharmacyId);

        if (!subscription) {
            throw new NotFoundException(MESSAGES.ERROR.NO_ACTIVE_SUBSCRIPTION);
        }

        return subscription;
    }

    async ensureActiveSubscription(pharmacyId: string) {
        const subscription = await this.findActiveByPharmacyId(pharmacyId);

        if (subscription.status === SubscriptionStatus.EXPIRED) {
            throw new ConflictException(MESSAGES.ERROR.SUBSCRIPTION_EXPIRED);
        }

        if (subscription.status === SubscriptionStatus.CANCELLED) {
            throw new ConflictException(MESSAGES.ERROR.SUBSCRIPTION_CANCELLED);
        }

        if (subscription.status === SubscriptionStatus.SUSPENDED) {
            throw new ConflictException(MESSAGES.ERROR.SUBSCRIPTION_SUSPENDED);
        }

        if (subscription.expires_at < new Date()) {
            throw new ConflictException(MESSAGES.ERROR.SUBSCRIPTION_EXPIRED);
        }

        return subscription;
    }

    async findActiveSubscriptionByPharmacyId(pharmacyId: string) {
        return this.subscriptionsRepository.findActiveSubscriptionByPharmacyId(pharmacyId);
    }
}
