export const MESSAGES = {
    SUCCESS: {
        FETCHED: 'Pharmacy retrieved successfully.',
        FETCHED_LIST: 'Pharmacies retrieved successfully.',
        CREATED: 'Pharmacy created successfully.',
        UPDATED: 'Pharmacy updated successfully.',
        STATUS_UPDATED: 'Pharmacy status updated successfully.',
        DELETED: 'Pharmacy deleted successfully.',
        RESTORED: 'Pharmacy restored successfully.',
    },

    ERROR: {
        NOT_FOUND: 'Pharmacy not found.',
        NAME_ALREADY_EXISTS: 'A pharmacy with this name already exists.',
        PHARMACY_ALREADY_EXISTS: 'A pharmacy already exists for this account.',
        ALREADY_ACTIVE: 'Pharmacy is already active.',
        PHARMACY_ID_REQUIRED: "Pharamcy id is required."
    },
} as const;
