export const MESSAGES = {
    SUCCESS: {
        FETCHED: 'Product type retrieved successfully.',
        FETCHED_LIST: 'Product types retrieved successfully.',
        CREATED: 'Product type created successfully.',
        UPDATED: 'Product type updated successfully.',
        DELETED: 'Product type deleted successfully.',
    },

    ERROR: {
        NOT_FOUND: 'Product type not found.',
        ALREADY_EXISTS: 'Product type with this name already exists.',
        IN_USE: 'Product type cannot be deleted because it is being used by products.',
    },
} as const;
