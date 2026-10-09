export const MESSAGES = {
    SUCCESS: {
        FETCHED: 'Category retrieved successfully.',
        FETCHED_LIST: 'Categories retrieved successfully.',
        CREATED: 'Category created successfully.',
        UPDATED: 'Category updated successfully.',
        DELETED: 'Category deleted successfully.',
    },

    ERROR: {
        NOT_FOUND: 'Category not found.',
        ALREADY_EXISTS: 'Category with this name already exists.',
        IN_USE: 'Category cannot be deleted because it is being used by products.',
    },
} as const;
