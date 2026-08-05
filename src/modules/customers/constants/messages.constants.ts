export const MESSAGES = {
    SUCCESS: {
        CREATED: 'Customer created successfully.',
        UPDATED: 'Customer updated successfully.',
        DELETED: 'Customer deleted successfully.',
    },

    ERROR: {
        NOT_FOUND: 'Customer not found.',
        PHONE_ALREADY_EXISTS: 'Customer phone already exists.',
        EMAIL_ALREADY_EXISTS: 'Customer email already exists.',
        CUSTOMER_REQUIRED: 'Customer is required to perform this action',
    },
} as const;
