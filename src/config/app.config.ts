const env = process.env;

export default () => ({
    app: {
        name: env.APP_NAME ?? 'Pharmacy Backend',
        env: env.NODE_ENV ?? 'development',
        port: Number(env.PORT ?? 3000),
        apiPrefix: env.API_PREFIX ?? 'api',
        apiVersion: env.API_VERSION ?? 'v1',
    },

    database: {
        url: env.DATABASE_URL!,
    },

    jwt: {
        accessSecret: env.JWT_ACCESS_SECRET,
        accessTokenTtl: env.JWT_ACCESS_TOKEN_TTL ?? '15m',

        refreshSecret: env.JWT_REFRESH_SECRET,
        refreshTokenTtl: env.JWT_REFRESH_TOKEN_TTL ?? '30d',
    },

    otp: {
        length: Number(env.OTP_LENGTH ?? 6),
        expireMinutes: Number(env.OTP_EXPIRE_MINUTES ?? 10),
        maxVerifyAttempts: Number(env.OTP_MAX_VERIFY_ATTEMPTS ?? 5),
        maxResendPer24h: Number(env.OTP_MAX_RESEND_PER_24H ?? 3),
        resendCooldownSeconds: Number(env.OTP_RESEND_COOLDOWN_SECONDS ?? 60),
    },

    maintenance: {
        enabled: env.MAINTENANCE_MODE === 'true',
        bypassKey: env.MAINTENANCE_BYPASS_KEY,
    },

    throttler: {
        /** Global rate limit — requests per TTL window */
        ttl: Number(env.THROTTLER_TTL_MS ?? 60000),
        limit: Number(env.THROTTLER_LIMIT ?? 100),
    },

    swagger: {
        enabled: env.SWAGGER_ENABLED === 'true',
        path: env.SWAGGER_PATH ?? 'docs',
    },

    cors: {
        origin: env.CORS_ORIGIN ?? '*',
        credentials: env.CORS_CREDENTIALS === 'true',
    },
});
