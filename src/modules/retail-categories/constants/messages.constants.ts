export const MESSAGES = {
    SUCCESS: {
        FETCHED: 'Retail category retrieved successfully.',
        FETCHED_LIST: 'Retail categories retrieved successfully.',
        CREATED: 'Retail category created successfully.',
        UPDATED: 'Retail category updated successfully.',
        DELETED: 'Retail category deleted successfully.',
    },

    ERROR: {
        NOT_FOUND: 'Retail category not found.',
        ALREADY_EXISTS: 'Retail category with this name already exists.',
        IN_USE: 'Retail category cannot be deleted because it is being used by products.',
    },
} as const;
