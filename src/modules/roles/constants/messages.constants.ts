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
        ROLE_VIEW_FORBIDDEN: 'You do not have access to view this role.',
        ROLE_PERMISSION_VIEW_FORBIDDEN:
            'You can only view permissions for your role or its child roles.',
        ROLE_PERMISSION_UPDATE_FORBIDDEN:
            'You can only manage permissions for your child roles.',
        ROLE_ASSIGN_PERMISSION_FORBIDDEN:
            'You cannot assign permissions you do not possess.',
    },
} as const;
