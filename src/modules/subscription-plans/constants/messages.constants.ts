export const SUBSCRIPTION_PLAN_MESSAGES = {
    SUCCESS: {
        CREATED: 'Subscription plan created successfully.',
        UPDATED: 'Subscription plan updated successfully.',
        FETCHED: 'Subscription plans retrieved successfully.',
        FETCHED_ONE: 'Subscription plan retrieved successfully.',
        ACTIVATED: 'Subscription plan activated successfully.',
        DEACTIVATED: 'Subscription plan deactivated successfully.',
    },

    ERROR: {
        NOT_FOUND: 'Subscription plan not found.',
        NAME_ALREADY_EXISTS: 'Subscription plan name already exists.',
        INACTIVE: 'Subscription plan is inactive.',
    },
} as const;
