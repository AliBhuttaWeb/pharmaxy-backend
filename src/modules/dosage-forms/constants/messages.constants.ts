export const MESSAGES = {
    SUCCESS: {
        FETCHED: 'Dosage form retrieved successfully.',
        FETCHED_LIST: 'Dosage forms retrieved successfully.',
        CREATED: 'Dosage form created successfully.',
        UPDATED: 'Dosage form updated successfully.',
        DELETED: 'Dosage form deleted successfully.',
    },

    ERROR: {
        NOT_FOUND: 'Dosage form not found.',
        ALREADY_EXISTS: 'Dosage form with this name already exists.',
        IN_USE: 'Dosage form cannot be deleted because it is being used by products.',
    },
} as const;
