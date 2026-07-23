import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { AppModule } from '@/app.module';
import { setupSwagger } from '@/config/swagger.config';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap(): Promise<void> {
    const logger = new Logger('Bootstrap');

    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    });

    // Trust reverse proxy (Nginx, Cloudflare, Kubernetes Ingress)
    app.getHttpAdapter().getInstance().set('trust proxy', 1);

    // Global API prefix
    app.setGlobalPrefix('api');

    // API versioning: /api/v1/*
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    // Global validation
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
            stopAtFirstError: false,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Body parser limits
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(
        bodyParser.urlencoded({
            limit: '10mb',
            extended: true,
        }),
    );

    // Cookie parser
    app.use(cookieParser());

    // CORS
    app.enableCors({
        origin: true, // replace with whitelist in production
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
        exposedHeaders: ['Content-Disposition'],
    });

    // Swagger
    setupSwagger(app);

    // Graceful shutdown
    app.enableShutdownHooks();

    const configService = app.get(ConfigService);
    app.useGlobalFilters(new GlobalExceptionFilter(configService));

    const port = configService.getOrThrow('app.port');
    await app.listen(port);

    const url = await app.getUrl();

    logger.log(`🚀 Pharmaxy API is running on: ${url}`);
    logger.log(`📚 Swagger Docs: ${url}/docs`);
    logger.log(`🔐 API Base URL: ${url}/api/v1`);
}

void bootstrap();
