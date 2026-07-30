export const MESSAGES = {
    SUCCESS: {
        FETCHED: 'Manufacturer retrieved successfully.',
        FETCHED_LIST: 'Manufacturers retrieved successfully.',
        CREATED: 'Manufacturer created successfully.',
        UPDATED: 'Manufacturer updated successfully.',
        DELETED: 'Manufacturer deleted successfully.',
    },

    ERROR: {
        NOT_FOUND: 'Manufacturer not found.',
        NAME_ALREADY_EXISTS: 'A manufacturer with this name already exists.',
    },
} as const;
