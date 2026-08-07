import { PrismaModule } from '@/database/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { BranchContextService } from './services/branch-context.service';
import { RequestContextInterceptor } from './context/request-context.interceptor';

@Module({
    imports: [PrismaModule],

    providers: [
        BranchContextService,
        {
            provide: APP_INTERCEPTOR,
            useClass: RequestContextInterceptor,
        },
    ],

    exports: [BranchContextService],
})
export class CommonModule {}
