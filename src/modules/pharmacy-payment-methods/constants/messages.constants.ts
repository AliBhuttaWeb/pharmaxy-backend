export const MESSAGES = {
    SUCCESS: {},
    ERROR: {
        NOT_FOUND: 'Pharmacy payment method not found.',
        PAYMENT_METHOD_NOT_FOUND: 'Payment method not found.',
        PAYMENT_METHOD_INACTIVE: 'Payment method is inactive.',
        ALREADY_CONFIGURED: 'Payment method is already configured for this pharmacy.',
    },
} as const;
