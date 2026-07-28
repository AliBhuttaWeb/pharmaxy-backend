export const MESSAGES = {
    SUCCESS: {
        SUPER_ADMIN_CREATED: 'Super Admin seeded successfully.',
    },

    ERROR: {
        SUPER_ADMIN_ENV_MISSING: 'Missing Super Admin environment variables.',

        SUPER_ADMIN_ROLE_NOT_FOUND: 'SUPER_ADMIN role not found. Seed roles before users.',
    },
} as const;
