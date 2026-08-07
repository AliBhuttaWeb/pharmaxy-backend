import { ApiPropertyOptional } from '@nestjs/swagger';

import { BillingCycle } from '@gen/prisma/client';

import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '@/common/pagination';

export class SubscriptionPlanQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({
        enum: BillingCycle,
    })
    @IsOptional()
    @IsEnum(BillingCycle)
    billing_cycle?: BillingCycle;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
