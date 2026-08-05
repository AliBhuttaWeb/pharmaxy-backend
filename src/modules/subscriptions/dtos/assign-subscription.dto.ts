import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { IsBoolean, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class AssignSubscriptionDto {
    @ApiProperty()
    @IsUUID()
    pharmacy_id!: string;

    @ApiProperty()
    @IsUUID()
    subscription_plan_id!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    started_at?: string;

    @ApiPropertyOptional({
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    auto_renew?: boolean;
}
