export const MESSAGES = {
    SUCCESS: {
        ROLES_SEEDED: 'Roles seeded successfully.',
        ROLES_PERMISSIONS_SEEDED: 'Roles permissions seeded successfully.',
        PERMISSIONS_SEEDED: 'Permissions seeded successfully.',
        SUPER_ADMIN_CREATED: 'Super Admin seeded successfully.',

        RETAIL_CATEGORIES_SEEDED: 'Retail categories seeded successfully.',
        PRODUCT_TYPES_SEEDED: 'Product types seeded successfully.',
        MANUFACTURERS_SEEDED: 'Manufacturers seeded successfully.',
        DOSAGE_FORMS_SEEDED: 'Dosage forms seeded successfully.',
    },

    ERROR: {
        SUPER_ADMIN_ENV_MISSING: 'Missing Super Admin environment variables.',

        SUPER_ADMIN_ROLE_NOT_FOUND: 'SUPER_ADMIN role not found. Seed roles before users.',
    },
} as const;
