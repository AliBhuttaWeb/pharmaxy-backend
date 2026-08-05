import { ConflictException, Injectable } from '@nestjs/common';
import { SubscriptionStatus } from '@prisma/client';

import { AuthenticatedUser } from '@/modules/auth/types';
import { isSuperAdmin } from '@/common/helpers';
import { SubscriptionsRepository } from '../repositories/subscriptions.repository';
import { MESSAGES } from '../constants';

@Injectable()
export class SubscriptionConstraintService {
    constructor(
        private readonly subscriptionsRepository: SubscriptionsRepository,
    ) {}

    /**
     * Internal assertion helper to verify active subscription status.
     */
    async ensureActiveSubscription(pharmacyId: string) {
        const subscription = await this.subscriptionsRepository.findActiveByPharmacyId(pharmacyId);

        if (!subscription) {
            throw new ConflictException(MESSAGES.ERROR.NO_ACTIVE_SUBSCRIPTION);
        }

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

    /**
     * Validates branch creation limits against the active subscription plan.
     * SUPER_ADMIN bypasses all limit checks automatically.
     */
    async validateBranchLimit(user: AuthenticatedUser, currentBranchCount: number): Promise<void> {
        if (isSuperAdmin(user)) {
            return;
        }

        const pharmacyId = user.pharmacyId;
        if (!pharmacyId) {
            throw new ConflictException(MESSAGES.ERROR.NO_ACTIVE_SUBSCRIPTION);
        }

        const subscription = await this.ensureActiveSubscription(pharmacyId);
        const maxBranches = subscription.plan.max_branches;

        if (maxBranches !== null && currentBranchCount >= maxBranches) {
            throw new ConflictException(MESSAGES.ERROR.BRANCH_LIMIT_REACHED);
        }
    }

    /**
     * Validates user creation limits against the active subscription plan.
     * SUPER_ADMIN bypasses all limit checks automatically.
     */
    async validateUserLimit(
        user: AuthenticatedUser,
        targetPharmacyId: string,
        currentUserCount: number,
    ): Promise<void> {
        if (isSuperAdmin(user)) {
            return;
        }

        const subscription = await this.ensureActiveSubscription(targetPharmacyId);
        const maxUsers = subscription.plan.max_users;

        if (maxUsers !== null && currentUserCount >= maxUsers) {
            throw new ConflictException(MESSAGES.ERROR.USER_LIMIT_REACHED);
        }
    }

    /**
     * Validates feature availability for quick sale or nearby inventory.
     * SUPER_ADMIN bypasses all feature restrictions.
     */
    async validateFeatureAccess(
        user: AuthenticatedUser,
        feature: 'allow_quick_sale' | 'allow_nearby_inventory',
    ): Promise<void> {
        if (isSuperAdmin(user)) {
            return;
        }

        if (!user.pharmacyId) {
            throw new ConflictException(MESSAGES.ERROR.NO_ACTIVE_SUBSCRIPTION);
        }

        const subscription = await this.ensureActiveSubscription(user.pharmacyId);

        if (feature === 'allow_quick_sale' && !subscription.plan.allow_quick_sale) {
            throw new ConflictException(MESSAGES.ERROR.QUICK_SALE_NOT_ALLOWED);
        }

        if (feature === 'allow_nearby_inventory' && !subscription.plan.allow_nearby_inventory) {
            throw new ConflictException(MESSAGES.ERROR.NEARBY_INVENTORY_NOT_ALLOWED);
        }
    }
}
