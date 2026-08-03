import { Type } from 'class-transformer';

import {
    ArrayMinSize,
    IsArray,
    IsDateString,
    IsDecimal,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
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
        example: '500.00',
        default: '0.00',
    })
    @IsOptional()
    @IsDecimal({
        decimal_digits: '0,2',
    })
    discount_amount?: string;

    @ApiPropertyOptional({
        example: '1800.00',
        default: '0.00',
    })
    @IsOptional()
    @IsDecimal({
        decimal_digits: '0,2',
    })
    tax_amount?: string;

    @ApiPropertyOptional({
        example: '300.00',
        default: '0.00',
    })
    @IsOptional()
    @IsDecimal({
        decimal_digits: '0,2',
    })
    shipping_amount?: string;

    @ApiPropertyOptional({
        example: '100.00',
        default: '0.00',
    })
    @IsOptional()
    @IsDecimal({
        decimal_digits: '0,2',
    })
    other_charges?: string;

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
