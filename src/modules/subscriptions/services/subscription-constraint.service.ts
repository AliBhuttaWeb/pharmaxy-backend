import { ConflictException, Injectable } from '@nestjs/common';
import { SubscriptionStatus } from '@gen/prisma/client';

import { AuthenticatedUser } from '@/modules/auth/types';
import { SubscriptionsRepository } from '../repositories/subscriptions.repository';
import { MESSAGES, PREMIUM_FEATUIRES } from '../constants';
import { PremiumFeatures, ValidateBranchesLimit } from '../types';

@Injectable()
export class SubscriptionConstraintService {
    constructor(private readonly subscriptionsRepository: SubscriptionsRepository) {}

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
     */
    async validateBranchesLimit(data: ValidateBranchesLimit): Promise<void> {
        const { pharmacyId, currentBranchCount } = data;
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
     */
    async validateUserLimit(targetPharmacyId: string, currentUserCount: number): Promise<void> {
        const subscription = await this.ensureActiveSubscription(targetPharmacyId);
        const maxUsers = subscription.plan.max_users_per_branch;

        if (maxUsers !== null && currentUserCount >= maxUsers) {
            throw new ConflictException(MESSAGES.ERROR.USER_LIMIT_REACHED);
        }
    }

    /**
     * Validates feature availability for quick sale or nearby inventory..
     */
    async validateFeatureAccess(user: AuthenticatedUser, feature: PremiumFeatures): Promise<void> {
        if (!user.pharmacy_id) {
            throw new ConflictException(MESSAGES.ERROR.NO_ACTIVE_SUBSCRIPTION);
        }

        const subscription = await this.ensureActiveSubscription(user.pharmacy_id);

        if (!subscription.plan[feature]) {
            throw new ConflictException(MESSAGES.ERROR.FEATURE_NOT_ALLOWED(feature));
        }
    }
}
