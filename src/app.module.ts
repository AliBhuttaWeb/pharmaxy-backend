import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import envValidationSchema from '@/config/env-validation.config';
import appConfig from '@/config/app.config';
import { APP_GUARD } from '@nestjs/core';

import { JwtAuthGuard } from '@common/guards';
import { PrismaModule } from '@/database/prisma/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { UsersModule } from './modules/users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
            validationSchema: envValidationSchema,
            expandVariables: true,
            cache: true,
        }),
        PrismaModule,
        AuthModule,
        RolesModule,
        PermissionsModule,
        UsersModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
