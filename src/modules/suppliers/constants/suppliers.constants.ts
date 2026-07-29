export const MESSAGES = {
    SUCCESS: {
        FETCHED: 'Supplier retrieved successfully.',
        FETCHED_LIST: 'Suppliers retrieved successfully.',
        CREATED: 'Supplier created successfully.',
        UPDATED: 'Supplier updated successfully.',
        DELETED: 'Supplier deleted successfully.',
        STATUS_UPDATED: 'Supplier status updated successfully.',
    },

    ERROR: {
        NOT_FOUND: 'Supplier not found.',
        NAME_ALREADY_EXISTS: 'A supplier with this name already exists.',
    },
} as const;
