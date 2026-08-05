export const MESSAGES = {
    SUCCESS: {
        FETCHED: 'Branch product retrieved successfully.',
        FETCHED_LIST: 'Branch products retrieved successfully.',
        CREATED: 'Branch product created successfully.',
        UPDATED: 'Branch product updated successfully.',
        DELETED: 'Branch product deleted successfully.',
        STOCK_RECEIVED: 'Stock received successfully',
    },

    ERROR: {
        NOT_FOUND: 'Branch product not found.',
        ALREADY_EXISTS: 'This product has already been added to the selected branch.',
        BRANCH_NOT_FOUND: 'Branch not found.',
        PRODUCT_NOT_FOUND: 'Product not found.',
        PRODUCT_REQUIRED: 'Product details are required when no product is selected.',
        BATCH_NOT_FOUND: 'No batch found.',
    },
} as const;
