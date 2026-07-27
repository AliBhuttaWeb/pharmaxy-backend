import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(config: ConfigService) {
        super(PrismaService.createOptions(config));
    }

    private static createOptions(config: ConfigService) {
        const isDevelopment = config.getOrThrow<string>('app.env') === 'development';

        return {
            adapter: new PrismaPg({
                connectionString: config.getOrThrow<string>('database.url'),
            }),
            log: isDevelopment ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
        } satisfies ConstructorParameters<typeof PrismaClient>[0];
    }

    async transaction<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
        return this.$transaction(callback);
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
