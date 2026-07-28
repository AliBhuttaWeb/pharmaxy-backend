export const MESSAGES = {
    SUCCESS: {
        FETCHED: 'Roles retrieved successfully.',
        UPDATED: 'Role updated successfully.',
        PERMISSIONS_UPDATED: 'Role permissions updated successfully.',
    },

    ERROR: {
        NOT_FOUND: 'Role not found.',
        DUPLICATE: 'Role already exists.',
        CANNOT_DELETE: 'This role cannot be deleted.',
    },
} as const;
