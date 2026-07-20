export const APP = Object.freeze({
    NAME: 'Pharmaxy',

    API: {
        NAME: 'Pharmaxy API',
        DESCRIPTION: 'Production-grade Pharmacy POS & Inventory SaaS Backend API',
        PREFIX: 'api',
        DEFAULT_VERSION: '1',
    },

    SWAGGER: {
        PATH: 'docs',
        AUTH_NAME: 'JWT-auth',
        TAGS: [
            'Auth',
            'Users',
            'Roles',
            'Permissions',
            'Pharmacies',
            'Branches',
            'Products',
            'Inventory',
            'Purchase Orders',
            'Invoices',
        ] as const,
    },

    COMPANY: {
        NAME: 'Pharmaxy',
        WEBSITE: 'https://pharmaxy.com',
        SUPPORT_EMAIL: 'support@pharmaxy.com',
    },
} as const);
