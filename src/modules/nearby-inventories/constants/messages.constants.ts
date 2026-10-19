export const MESSAGES = {
    SUCCESS: {
        FETCHED_LIST: 'Nearby store inventory retrieved successfully.',
        STORE_FETCHED: 'Nearby store details retrieved successfully.',
        RESERVED: 'Item reserved successfully from nearby branch.',
        RESERVATION_FETCHED: 'Reservation retrieved successfully.',
        RESERVATIONS_LIST_FETCHED: 'Reservations retrieved successfully.',
        RESERVATION_STATUS_UPDATED: 'Reservation status updated successfully.',
    },

    ERROR: {
        BRANCH_PRODUCT_NOT_FOUND: 'Target branch product not found or inactive.',
        STORE_NOT_FOUND: 'Target branch not found or inactive.',
        CANNOT_RESERVE_FROM_OWN_BRANCH: 'You cannot reserve an item from your own active branch.',
        INSUFFICIENT_STOCK: 'Target branch does not have sufficient stock to reserve.',
        INVALID_EXPIRY_TIME: 'Reservation expiry time must be in the future.',
        RESERVATION_NOT_FOUND: 'Reservation not found.',
        RESERVATION_ACCESS_DENIED: 'You do not have access to this reservation.',
        RESERVATION_ALREADY_FINALIZED:
            'This reservation is already completed, cancelled, or expired.',
        ONLY_TARGET_BRANCH_CAN_CONFIRM_OR_COMPLETE:
            'Only the fulfilling (target) branch can confirm or complete a reservation.',
        PRODUCT_BATCH_NOT_FOUND:
            'Specified product batch was not found or does not have sufficient stock.',
    },
} as const;
