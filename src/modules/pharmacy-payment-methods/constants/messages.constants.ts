export const MESSAGES = {
    SUCCESS: {
        CREATED: 'Pharmacy payment method configured successfully.',
        UPDATED: 'Pharmacy payment method updated successfully.',
        STATUS_UPDATED: 'Pharmacy payment method status updated successfully.',
        DELETED: 'Pharmacy payment method deleted successfully.',
    },
    ERROR: {
        NOT_FOUND: 'Pharmacy payment method not found.',
        PAYMENT_METHOD_NOT_FOUND: 'Payment method not found.',
        PAYMENT_METHOD_INACTIVE: 'Payment method is inactive.',
        ALREADY_CONFIGURED: 'Payment method is already configured for this pharmacy.',
    },
} as const;
