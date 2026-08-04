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
import { RetailCategoriesModule } from './modules/retail-categories/retail-categories.module';
import { ProductTypesModule } from './modules/product-types/product-types.module';
import { DosageFormsModule } from './modules/dosage-forms/dosage-forms.module';
import { ProductsModule } from './modules/products/products.module';
import { BranchProductsModule } from './modules/branch-products/branch-products.module';
import { PurchaseOrdersModule } from './modules/purchase-orders/purchase-orders.module';
import { CustomersModule } from './modules/customers/customers.module';
import { PosModule } from './modules/pos/pos.module';
import { HoldOrdersModule } from './modules/hold-orders/hold-orders.module';
import { ReturnsModule } from './modules/returns/returns.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

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
        RetailCategoriesModule,
        ProductTypesModule,
        DosageFormsModule,
        ProductsModule,
        BranchProductsModule,
        PurchaseOrdersModule,
        CustomersModule,
        PosModule,
        HoldOrdersModule,
        ReturnsModule,
        DashboardModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
