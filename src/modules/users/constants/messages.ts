export const MESSAGES = {
    SUCCESS: {
        CREATED: 'User created successfully.',
        UPDATED: 'User updated successfully.',
        DELETED: 'User deleted successfully.',
        FETCHED: 'User retrieved successfully.',
        LIST_FETCHED: 'Users retrieved successfully.',
    },

    ERROR: {
        NOT_FOUND: 'User not found.',
        ALREADY_EXISTS: 'User already exists.',
        EMAIL_ALREADY_EXISTS: 'Email already exists.',
        PHONE_ALREADY_EXISTS: 'Phone number already exists.',
    },
} as const;
