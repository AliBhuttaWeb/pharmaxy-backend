export const MESSAGES = {
    SUCCESS: {
        CREATED: 'Payment method created successfully.',
        UPDATED: 'Payment method updated successfully.',
        DELETED: 'Payment method deleted successfully.',
        FETCHED: 'Payment method retrieved successfully.',
        LIST_FETCHED: 'Payment methods retrieved successfully.',
    },
    ERROR: {
        NOT_FOUND: 'Payment method not found.',
        ALREADY_EXISTS: 'Payment method with this name or code already exists.',
        NAME_ALREADY_EXISTS: 'Payment method with this name already exists.',
        CODE_ALREADY_EXISTS: 'Payment method with this code already exists.',
        IN_USE: 'Cannot delete payment method as it is being used by pharmacies.',
    },
} as const;
