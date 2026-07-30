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
        NAME_ALREADY_EXISTS:
            'A category with this name already exists.',
        PARENT_NOT_FOUND:
            'Parent category not found.',
        INVALID_PARENT:
            'A category cannot be its own parent.',
    },
} as const;