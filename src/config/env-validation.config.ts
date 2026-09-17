import * as Joi from 'joi';

export default Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

    APP_NAME: Joi.string().default('Pharmacy Backend'),

    PORT: Joi.number().default(3000),

    API_PREFIX: Joi.string().default('api'),

    API_VERSION: Joi.string().default('v1'),

    DATABASE_URL: Joi.string().required(),

    JWT_ACCESS_SECRET: Joi.string().min(32).required(),

    JWT_REFRESH_SECRET: Joi.string().min(32).required(),

    JWT_ACCESS_TOKEN_TTL: Joi.string().default('15m'),

    JWT_REFRESH_TOKEN_TTL: Joi.string().default('30d'),

    OTP_LENGTH: Joi.number().integer().min(4).max(10).default(6),

    OTP_EXPIRE_MINUTES: Joi.number().integer().min(1).default(10),

    OTP_MAX_VERIFY_ATTEMPTS: Joi.number().integer().min(1).default(5),

    OTP_MAX_RESEND_PER_24H: Joi.number().integer().min(1).default(3),

    OTP_RESEND_COOLDOWN_SECONDS: Joi.number().integer().min(0).default(60),

    MAINTENANCE_MODE: Joi.boolean().default(false),

    MAINTENANCE_BYPASS_KEY: Joi.string().optional(),

    THROTTLER_TTL_MS: Joi.number().integer().min(1000).default(60000),

    THROTTLER_LIMIT: Joi.number().integer().min(1).default(100),

    SWAGGER_ENABLED: Joi.boolean().default(true),

    SWAGGER_PATH: Joi.string().default('docs'),

    CORS_ORIGIN: Joi.string().default('*'),

    CORS_CREDENTIALS: Joi.boolean().default(true),
});
