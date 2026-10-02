export const MESSAGES = {
    SUCCESS: {},

    ERROR: {
        PAYMENT_METHOD_NOT_BELONGS_TO_PHARMACY: (payment_method_id: string) =>
            `Payment method ${payment_method_id} does not exist or does not belong to this pharmacy`,
        PHARMACY_NOT_FOUND: 'Pharmacy not found.',
        QUANTITY_MUST_BE_AT_LEAST_ONE: 'Requested quantity must be at least 1.',
        INSUFFICIENT_BATCH_STOCK: 'Insufficient batch stock.',
        SALE_ITEM_QUANTITY_MUST_BE_AT_LEAST_ONE: 'Sale item quantity must be at least 1.',
    },
} as const;

