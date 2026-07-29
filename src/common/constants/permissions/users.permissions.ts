export const USERS_PERMISSIONS = {
    USER_VIEW_LIST: {
        name: 'users.view.list',
        description: 'View users listing',
    },

    USER_VIEW_DETAIL: {
        name: 'users.view.detail',
        description: 'View user details',
    },

    USER_CREATE: {
        name: 'users.create',
        description: 'Create users',
    },

    USER_UPDATE: {
        name: 'users.update',
        description: 'Update users',
    },

    USER_UPDATE_STATUS: {
        name: 'users.update.status',
        description: 'Update user status',
    },

    USER_DELETE: {
        name: 'users.delete',
        description: 'Delete users',
    },

    USER_ASSIGN_ROLE: {
        name: 'users.assign.role',
        description: 'Assign roles to users',
    },

    USER_UPDATE_PROFILE: {
        name: 'users.update.profile',
        description: 'Update own profile',
    },

    USER_VIEW_PROFILE: {
        name: 'users.view.profile',
        description: 'View own profile',
    },
} as const;
