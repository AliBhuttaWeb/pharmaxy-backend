export const MESSAGES = {
    SUCCESS: {
        CREATED: 'Sale return created successfully.',
        LISTED: 'Sale returns retrieved successfully.',
        RETRIEVED: 'Sale return retrieved successfully.',
    },

    ERROR: {
        NOT_FOUND: 'Sale return not found.',
        INVOICE_NOT_FOUND: 'Invoice not found.',
        INVOICE_BRANCH_MISMATCH: 'Invoice does not belong to the active branch.',
        INVOICE_ALREADY_CANCELLED: 'Invoice is cancelled and cannot be returned.',
        RETURN_ITEM_NOT_FOUND: 'Return item not found.',
        INVALID_RETURN_QUANTITY: 'Return quantity exceeds the remaining sale quantity.',
        INVALID_RETURN_AMOUNT: 'Invalid refund amount.',
        PRODUCT_BATCH_NOT_FOUND: 'Product batch not found.',
        BRANCH_PRODUCT_NOT_FOUND: 'Branch product not found.',
        ALREADY_CANCELLED: 'Sale return is already cancelled.',
    },
} as const;
