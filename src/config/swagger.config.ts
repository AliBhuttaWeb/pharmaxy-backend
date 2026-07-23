import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { APP } from '@/common/constants';

export function setupSwagger(app: INestApplication): void {
    const builder = new DocumentBuilder()
        .setTitle(APP.API.NAME)
        .setDescription(APP.API.DESCRIPTION)
        .setVersion('1.0.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Enter JWT access token',
            },
            APP.SWAGGER.AUTH_NAME,
        );

    // APP.SWAGGER.TAGS.forEach((tag) => builder.addTag(tag));

    const config = builder.build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(APP.SWAGGER.PATH, app, document, {
        customSiteTitle: `${APP.API.NAME} Docs`,
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
    });
}
