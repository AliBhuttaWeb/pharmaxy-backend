import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDecimal, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreatePurchaseOrderItemDto {
    @ApiProperty()
    @IsUUID()
    product_id!: string;

    @ApiProperty({
        example: '100.000',
        description: 'Quantity ordered from supplier',
    })
    @IsDecimal({
        decimal_digits: '0,3',
    })
    ordered_quantity!: string;

    @ApiProperty({
        example: '250.00',
        description: 'Unit purchase cost',
    })
    @IsDecimal({
        decimal_digits: '0,2',
    })
    unit_cost!: string;

    @ApiPropertyOptional({
        example: '5.00',
        description: 'Discount percentage',
    })
    @IsOptional()
    @IsDecimal({
        decimal_digits: '0,2',
    })
    discount_percentage?: string;

    @ApiPropertyOptional({
        example: '500.00',
        description: 'Discount amount',
    })
    @IsOptional()
    @IsDecimal({
        decimal_digits: '0,2',
    })
    discount_amount?: string;

    @ApiPropertyOptional({
        example: '18.00',
        description: 'Tax percentage',
    })
    @IsOptional()
    @IsDecimal({
        decimal_digits: '0,2',
    })
    tax_percentage?: string;

    @ApiPropertyOptional({
        example: '900.00',
        description: 'Tax amount',
    })
    @IsOptional()
    @IsDecimal({
        decimal_digits: '0,2',
    })
    tax_amount?: string;

    @ApiPropertyOptional({
        maxLength: 1000,
        description: 'Additional remarks',
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    remarks?: string;
}
