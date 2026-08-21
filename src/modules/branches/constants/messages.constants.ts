export const MESSAGES = {
    SUCCESS: {
        FETCHED: 'Branch retrieved successfully.',
        FETCHED_LIST: 'Branches retrieved successfully.',
        CREATED: 'Branch created successfully.',
        UPDATED: 'Branch updated successfully.',
        STATUS_UPDATED: 'Branch status updated successfully.',
        DELETED: 'Branch deleted successfully.',
    },

    ERROR: {
        NOT_FOUND: 'Branch not found.',
        NAME_ALREADY_EXISTS: 'A branch with this name already exists in the pharmacy.',
        MAIN_BRANCH_ALREADY_EXISTS: 'A main branch already exists for this pharmacy.',
        NO_BRANCH_ASSIGNED: 'No branch assigned, contact your admin.',
        BRANCH_ACCESS_DENIED: "You don't have permissions to access this branch.",
        BRANCH_ID_REQUIRED: 'Branch id is required.',
    },
} as const;
