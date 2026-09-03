export const MESSAGES = {
    SUCCESS: {
    },

    ERROR: {
        PAYMENT_METHOD_NOT_BELONGS_TO_PHARMACY : (payment_method_id: string) => `Payment method ${payment_method_id} does not exist or does not belong to this pharmacy`
    },
} as const;
