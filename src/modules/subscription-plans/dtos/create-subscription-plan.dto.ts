import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BillingCycle } from '@prisma/client';

import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Min,
} from 'class-validator';

export class CreateSubscriptionPlanDto {
    @ApiProperty({
        example: 'Basic',
    })
    @IsString()
    name!: string;

    @ApiPropertyOptional({
        example: 'Basic pharmacy plan',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        enum: BillingCycle,
    })
    @IsEnum(BillingCycle)
    billing_cycle!: BillingCycle;

    @ApiProperty({
        example: 1999,
    })
    @IsNumber()
    @IsPositive()
    price!: number;

    @ApiPropertyOptional({
        example: 3,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    max_branches?: number;

    @ApiPropertyOptional({
        example: 10,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    max_users?: number;

    @ApiProperty({
        example: 3,
    })
    @IsInt()
    @Min(1)
    report_history_months!: number;

    @ApiPropertyOptional({
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    allow_nearby_inventory?: boolean;

    @ApiPropertyOptional({
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    allow_quick_sale?: boolean;

    @ApiPropertyOptional({
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
