/**
 * Defines the application context in which a user is signing up.
 */
export const SIGNUP_SCOPES = {
    /** OpenMeds internal platform (support, sales, marketing, operations). */
    PLATFORM: 'PLATFORM',

    /** Pharmacy management console (owners, admins, staff). */
    CONSOLE: 'CONSOLE',

    /** Customer-facing pharmacy storefront or mobile application. */
    STORE: 'STORE',
} as const;
