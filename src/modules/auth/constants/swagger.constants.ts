export const SWAGGER = Object.freeze({
    AUTH: {
        LOGIN_EMAIL_DESCRIPTION: 'User email address',
        LOGIN_PASSWORD_DESCRIPTION: 'User password',
        REFRESH_TOKEN_DESCRIPTION: 'JWT refresh token',

        SIGNUP_FIRST_NAME_DESCRIPTION: 'User first name',
        SIGNUP_LAST_NAME_DESCRIPTION: 'User last name',
        SIGNUP_EMAIL_DESCRIPTION: 'User email address',
        SIGNUP_PHONE_DESCRIPTION: 'User phone number',
        SIGNUP_PASSWORD_DESCRIPTION: 'User account password',
        SIGNUP_ROLE_ID_DESCRIPTION: 'Role identifier assigned during signup',
        SIGNUP_SCOPE_DESCRIPTION: 'Platform where the signup request is initiated',

        EMAIL_EXAMPLE: 'admin@pharmacy.com',
        PASSWORD_EXAMPLE: 'P@ssw0rd123',
        REFRESH_TOKEN_EXAMPLE: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',

        FIRST_NAME_EXAMPLE: 'Ali',
        LAST_NAME_EXAMPLE: 'Bhutta',
        PHONE_EXAMPLE: '+923001234567',
        ROLE_ID_EXAMPLE: 'e4d0a8cf-7a75-4b8e-b4b8-f1d1d91d1d11',
        SIGNUP_SCOPE_EXAMPLE: 'console',
        // Field Descriptions
        FIRST_NAME_DESCRIPTION: 'User first name',
        LAST_NAME_DESCRIPTION: 'User last name',
        EMAIL_DESCRIPTION: 'User email address',
        PHONE_DESCRIPTION: 'User phone number',
        PASSWORD_DESCRIPTION: 'User password',
        ROLE_ID_DESCRIPTION: 'User role id',
    },
} as const);
