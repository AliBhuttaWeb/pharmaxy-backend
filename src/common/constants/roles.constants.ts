export const ROLES = {
    SUPER_ADMIN: {
        name: 'Super Admin',
        description: 'Platform administrator',
    },

    PHARMACY_ADMIN: {
        name: 'Pharmacy Admin',
        description: 'Administrator managing pharmacy operations',
    },

    CASHIER: {
        name: 'Cashier',
        description: 'Handles sales and customer transactions',
    },

    SUPPLIER: {
        name: 'Supplier',
        description: 'Supplier portal user',
    },

    USER: {
        name: 'User',
        description: 'Default authenticated user',
    },
} as const;
