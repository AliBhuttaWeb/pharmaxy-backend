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

    SWAGGER_ENABLED: Joi.boolean().default(true),

    SWAGGER_PATH: Joi.string().default('docs'),

    CORS_ORIGIN: Joi.string().default('*'),

    CORS_CREDENTIALS: Joi.boolean().default(true),
});
