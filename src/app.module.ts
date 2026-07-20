import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import envValidationSchema from '@/config/env-validation.config';
import appConfig from '@/config/app.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
            validationSchema: envValidationSchema,
            expandVariables: true,
            cache: true,
        }),
    ],
})
export class AppModule {}
