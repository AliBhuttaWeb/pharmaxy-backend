import { PrismaModule } from '@/database/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { BranchContextService } from './services/branch-context.service';

@Module({
    imports: [PrismaModule],

    providers: [BranchContextService],

    exports: [BranchContextService],
})
export class CommonModule {}
