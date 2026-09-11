export const MESSAGES = {
    SUCCESS: {
        FETCHED: 'Branch settings retrieved successfully.',
        UPDATED: 'Branch settings updated successfully.',
    },
    ERROR: {
        NOT_FOUND: 'Branch settings not found.',
        BRANCH_NOT_FOUND: 'Branch not found.',
        NO_ACTIVE_BRANCH: 'No active branch selected.',
        CRITICAL_EXCEEDS_MINIMUM: 'Critical stock quantity cannot exceed minimum stock quantity.',
        STOCK_SHARING_NOT_ALLOWED: 'This branch does not allow stock sharing.',
        RESERVATIONS_NOT_ALLOWED: 'This branch does not allow inventory reservations.',
    },
} as const;
