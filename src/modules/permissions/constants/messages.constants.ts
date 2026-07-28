export const MESSAGES = {
    SUCCESS: {
        FETCHED: 'Permissions retrieved successfully.',
    },

    ERROR: {
        NOT_FOUND: 'Permission not found.',
        DENIED: 'You do not have permission to perform this action.',
        DUPLICATE_PERMISSION_IDS: 'Duplicate permission IDs are not allowed.',
    },
} as const;
