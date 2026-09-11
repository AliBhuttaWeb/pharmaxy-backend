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
        INVOICE_ALREADY_REFUNDED: 'Invoice has already been fully refunded.',
        RETURN_ITEM_NOT_FOUND: 'Return item not found.',
        ITEM_ALREADY_RETURNED: 'This item has already been fully returned.',
        EXCEEDS_REMAINING_QUANTITY: 'Return quantity exceeds the remaining returnable quantity.',
        INVALID_RETURN_QUANTITY: 'Return quantity exceeds the maximum bought quantity.',
        INVALID_RETURN_AMOUNT: 'Invalid refund amount.',
        PRODUCT_BATCH_NOT_FOUND: 'Product batch not found.',
        BRANCH_PRODUCT_NOT_FOUND: 'Branch product not found.',
        ALREADY_CANCELLED: 'Sale return is already cancelled.',
        DUPLICATE_RETURN_ITEM: 'Duplicate return items found in request.',
        COMPLETED_CANNOT_BE_CANCELLED: 'Completed sale return cannot be cancelled.',
    },
} as const;
