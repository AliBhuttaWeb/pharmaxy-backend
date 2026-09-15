export const MESSAGES = {
    SUCCESS: {
        CREATED: 'User created successfully.',
        UPDATED: 'User updated successfully.',
        DELETED: 'User deleted successfully.',
        STATUS_UPDATED: 'User status updated successfully.',
        FETCHED: 'User retrieved successfully.',
        LIST_FETCHED: 'Users retrieved successfully.',
    },

    ERROR: {
        NOT_FOUND: 'User not found.',
        ALREADY_EXISTS: 'User already exists.',
        EMAIL_ALREADY_EXISTS: 'Email already exists.',
        PHONE_ALREADY_EXISTS: 'Phone number already exists.',
        BRANCH_SCOPED_USERS_ALLOWED_TO_BE_CREATED: 'Only branch-scoped users can be created.',
        INVALID_ROLE_SCOPE: 'Invalid role scope.',
        ROLE_NOT_FOUND: 'Role not found.',
        ROLE_SCOPE_MISMATCH: 'Selected role does not match the specified role scope.',
        ROLE_MUST_BE_CHILD: 'Assigned role must be a child of your role.',
    },
} as const;

