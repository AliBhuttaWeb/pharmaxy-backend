import { PrismaModule } from '@/database/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestContextInterceptor } from './context/request-context.interceptor';
import { BranchesService } from '@/modules/branches/services/branches.service';
import { BranchesModule } from '@/modules/branches/branches.module';

@Module({
    imports: [PrismaModule, BranchesModule],

    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: RequestContextInterceptor,
        },
    ],
})
export class CommonModule {}
