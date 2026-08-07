import 'dotenv/config';

import { PrismaClient, Permission, Role } from '@gen/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { SeedContext } from './seed.type';

import { seedPermissions } from './seeds/permissions.seed';
import { seedRoles } from './seeds/roles.seed';
import { seedRolePermissions } from './seeds/role-permissions.seed';
import { seedUsers } from './seeds/users.seeder';
import { seedDosageForms } from './seeds/dosage-form.seed';
import { seedManufacturers } from './seeds/manufacturers.seed';
import { seedProductTypes } from './seeds/product-type.seed';
import { seedRetailCategories } from './seeds/retail-category.seed';
import { seedSubscriptionPlans } from './seeds/subscription-plans.seed';
// import { seedRolePermissions } from './seeds/role-permissions.seed.ts';

async function main() {
    const prisma = new PrismaClient({
        adapter: new PrismaPg({
            connectionString: process.env.DATABASE_URL!,
        }),
    });

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
    seedDosageForms(ctx);
    seedManufacturers(ctx);
    seedProductTypes(ctx);
    seedRetailCategories(ctx);
    seedSubscriptionPlans(ctx);

    await prisma.$disconnect();
}

main().catch(console.error);
