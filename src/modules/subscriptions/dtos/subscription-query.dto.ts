import { ApiPropertyOptional } from '@nestjs/swagger';

import { SubscriptionStatus } from '@gen/prisma/client';

import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';

import { PaginationQueryDto } from '@/common/pagination';

export class SubscriptionQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({
        enum: SubscriptionStatus,
    })
    @IsOptional()
    @IsEnum(SubscriptionStatus)
    status?: SubscriptionStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    pharmacy_id?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    plan_id?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    expires_before?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    expires_after?: string;
}
