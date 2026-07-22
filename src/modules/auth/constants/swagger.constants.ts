export const SWAGGER = Object.freeze({
    AUTH: {
        LOGIN_EMAIL_DESCRIPTION: 'User email address',
        LOGIN_PASSWORD_DESCRIPTION: 'User password',
        REFRESH_TOKEN_DESCRIPTION: 'JWT refresh token',

        EMAIL_EXAMPLE: 'admin@pharmaxy.com',
        PASSWORD_EXAMPLE: 'P@ssw0rd123',
        REFRESH_TOKEN_EXAMPLE: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
} as const);
