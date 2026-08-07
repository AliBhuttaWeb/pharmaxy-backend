/**
 * Defines the application context in which a user is signing up.
 */
export const SIGNUP_SCOPES = {
    /** OpenMeds internal platform (support, sales, marketing, operations). */
    PLATFORM: 'platform',

    /** Pharmacy management console (owners, admins, staff). */
    CONSOLE: 'console',

    /** Customer-facing pharmacy storefront or mobile application. */
    STORE: 'store',
} as const;
