export const MESSAGES = {
    SUCCESS: {
        CREATED: 'Hold order created successfully.',
        FETCHED: 'Hold order retrieved successfully.',
        FETCHED_LIST: 'Hold orders retrieved successfully.',
        RESUMED: 'Hold order resumed successfully.',
        CANCELLED: 'Hold order cancelled successfully.',
    },

    ERROR: {
        NOT_FOUND: 'Hold order not found.',
        EXPIRED: 'Hold order has expired.',
        PRODUCT_NOT_FOUND: 'Branch product not found.',
        INVALID_PRODUCT: 'Selected product does not belong to the active branch.',
        PRODUCT_INACTIVE: 'Selected product is inactive.',
        INVALID_BRANCH: 'The selected product does not belong to the active branch.',
    },
} as const;
