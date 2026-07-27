import { PrismaClient, Permission, Role } from '@prisma/client';

export interface SeedContext {
    prisma: PrismaClient;

    roles: Map<string, Role>;
    permissions: Map<string, Permission>;
}
