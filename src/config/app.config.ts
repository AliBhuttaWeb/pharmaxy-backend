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

    swagger: {
        enabled: env.SWAGGER_ENABLED === 'true',
        path: env.SWAGGER_PATH ?? 'docs',
    },

    cors: {
        origin: env.CORS_ORIGIN ?? '*',
        credentials: env.CORS_CREDENTIALS === 'true',
    },
});
