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
import { PharmaciesModule } from './modules/pharmacies/pharmacies.module';
import { BranchesModule } from './modules/branches/branches.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { ManufacturersModule } from './modules/manufacturers/manufacturers.module';
import { CategoriesModule } from './modules/categories/categories.module';

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
        PharmaciesModule,
        BranchesModule,
        SuppliersModule,
        ManufacturersModule,
        CategoriesModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
