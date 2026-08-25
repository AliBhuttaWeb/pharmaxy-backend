import { ApiPropertyOptional } from '@nestjs/swagger';

import { BillingCycle } from '@gen/prisma/client';

import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '@/common/pagination';
import { Transform } from 'class-transformer';

export class SubscriptionPlanQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({
        enum: BillingCycle,
    })
    @IsOptional()
    @IsEnum(BillingCycle)
    billing_cycle?: BillingCycle;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;

        return value;
    })
    @IsBoolean()
    is_active?: boolean;
}
