export const MESSAGES = {
    SUCCESS: {
        FETCHED: 'Subscriptions retrieved successfully.',
        DETAIL: 'Subscription retrieved successfully.',
        CREATED: 'Subscription created successfully.',
        UPDATED: 'Subscription updated successfully.',
        CANCELLED: 'Subscription cancelled successfully.',
        RENEWED: 'Subscription renewed successfully.',
        UPGRADED: 'Subscription upgraded successfully.',
        DOWNGRADED: 'Subscription downgraded successfully.',
        MANUALLY_ASSIGNED: 'Subscription assigned successfully.',
    },

    ERROR: {
        NOT_FOUND: 'Subscription not found.',
        ACTIVE_SUBSCRIPTION_ALREADY_EXISTS:
            'An active subscription already exists for this pharmacy.',
        NO_ACTIVE_SUBSCRIPTION: 'No active subscription found for this pharmacy.',
        SUBSCRIPTION_EXPIRED: 'Your subscription has expired. Please renew your subscription.',
        SUBSCRIPTION_CANCELLED: 'Your subscription has been cancelled.',
        SUBSCRIPTION_SUSPENDED: 'Your subscription has been suspended.',
        BRANCH_LIMIT_REACHED:
            'You have reached the maximum number of branches allowed by your subscription plan.',
        USER_LIMIT_REACHED:
            'You have reached the maximum number of users allowed by your subscription plan.',
        REPORT_ACCESS_DENIED:
            'Your subscription plan does not allow access to reports for the selected period.',
        NEARBY_INVENTORY_NOT_ALLOWED:
            'Nearby inventory is not available in your current subscription plan.',
        QUICK_SALE_NOT_ALLOWED: 'Quick Sale is not available in your current subscription plan.',
        FEATURE_NOT_ALLOWED: (feature: string) =>
            `This ${feature} is not available in your current subscription plan.`,
    },
} as const;
