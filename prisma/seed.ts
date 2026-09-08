import 'dotenv/config';

import { PrismaClient, Permission, Role } from '@gen/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { SeedContext } from './seed.type';

import { seedPermissions } from './seeds/permissions.seed';
import { seedRoles } from './seeds/roles.seed';
import { seedRolePermissions } from './seeds/role-permissions.seed';
import { seedUsers } from './seeds/users.seeder';
import { seedDosageForms } from './seeds/dosage-forms.seed';
import { seedManufacturers } from './seeds/manufacturers.seed';
import { seedProductTypes } from './seeds/product-types.seed';
import { seedRetailCategories } from './seeds/retail-categories.seed';
import { seedSubscriptionPlans } from './seeds/subscription-plans.seed';
import { seedPaymentProviders } from './seeds/payment-providers.seed';
import { seedPaymentMethods } from './seeds/payment-methods.seed';
import { seedProducts } from './seeds/products.seed';

import pg from 'pg';
const { Pool } = pg;

async function main() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    const ctx: SeedContext = {
        prisma,

        roles: new Map<string, Role>(),

        permissions: new Map<string, Permission>(),
    };

    await seedRoles(ctx);
    await seedPermissions(ctx);

    // Load once
    ctx.roles = new Map((await prisma.role.findMany()).map((role) => [role.name, role]));

    ctx.permissions = new Map(
        (await prisma.permission.findMany()).map((permission) => [permission.name, permission]),
    );

    await seedRolePermissions(ctx);
    await seedUsers(ctx);
    await seedDosageForms(ctx);
    await seedManufacturers(ctx);
    await seedProductTypes(ctx);
    await seedRetailCategories(ctx);
    await seedProducts(ctx);
    await seedSubscriptionPlans(ctx);
    await seedPaymentProviders(ctx);
    await seedPaymentMethods(ctx);

    await prisma.$disconnect();
}

main().catch(console.error);
