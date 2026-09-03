import { PrismaModule } from '@/database/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { BranchContextService } from './services/branch-context.service';
import { RequestContextInterceptor } from './context/request-context.interceptor';
import { BranchesService } from '@/modules/branches/services/branches.service';
import { BranchesModule } from '@/modules/branches/branches.module';

@Module({
    imports: [PrismaModule, BranchesModule],

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
