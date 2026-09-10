import { Type } from 'class-transformer';

import {
    ArrayMinSize,
    IsArray,
    IsDateString,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    Min,
    ValidateNested,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { CreatePurchaseOrderItemDto } from './create-purchase-order-item.dto';

export class CreatePurchaseOrderDto {
    @ApiProperty()
    @IsUUID()
    branch_id!: string;

    @ApiProperty()
    @IsUUID()
    supplier_id!: string;

    @ApiProperty({
        example: '2026-08-03',
        description: 'Purchase order date',
    })
    @IsDateString()
    order_date!: string;

    @ApiPropertyOptional({
        example: '2026-08-10',
        description: 'Expected delivery date',
    })
    @IsOptional()
    @IsDateString()
    expected_delivery_date?: string;

    @ApiPropertyOptional({
        example: 0.5,
        default: 0,
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 4 })
    @Min(0)
    discount_amount?: number;

    @ApiPropertyOptional({
        example: 1.8,
        default: 0,
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 4 })
    @Min(0)
    tax_amount?: number;

    @ApiPropertyOptional({
        example: 3.0,
        default: 0,
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 4 })
    @Min(0)
    shipping_amount?: number;

    @ApiPropertyOptional({
        example: 1.0,
        default: 0,
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 4 })
    @Min(0)
    other_charges?: number;

    @ApiPropertyOptional({
        maxLength: 5000,
    })
    @IsOptional()
    @IsString()
    @MaxLength(5000)
    supplier_notes?: string;

    @ApiPropertyOptional({
        maxLength: 5000,
    })
    @IsOptional()
    @IsString()
    @MaxLength(5000)
    internal_notes?: string;

    @ApiProperty({
        type: CreatePurchaseOrderItemDto,
        isArray: true,
    })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({
        each: true,
    })
    @Type(() => CreatePurchaseOrderItemDto)
    items!: CreatePurchaseOrderItemDto[];
}
