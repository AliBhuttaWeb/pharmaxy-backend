export const JWT = Object.freeze({
    PASSPORT_ERROR: {
        TOKEN_EXPIRED: 'TokenExpiredError',
        INVALID_TOKEN: 'JsonWebTokenError',
        NOT_BEFORE: 'NotBeforeError',
    },
} as const);
