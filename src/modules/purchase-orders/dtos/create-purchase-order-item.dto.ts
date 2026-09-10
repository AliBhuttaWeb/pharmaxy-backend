import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreatePurchaseOrderItemDto {
    @ApiProperty()
    @IsUUID()
    product_id!: string;

    @ApiProperty({
        example: 100,
        description: 'Quantity ordered from supplier',
    })
    @IsInt()
    @Min(1)
    ordered_quantity!: number;

    @ApiProperty({
        example: 2.5,
        description: 'Unit purchase cost',
    })
    @IsNumber({ maxDecimalPlaces: 4 })
    @Min(0.0001)
    unit_cost!: number;

    @ApiPropertyOptional({
        example: 5.5,
        description: 'Discount percentage',
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    discount_percentage?: number;

    @ApiPropertyOptional({
        example: 0.5,
        description: 'Discount amount',
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 4 })
    @Min(0)
    discount_amount?: number;

    @ApiPropertyOptional({
        example: 18.5,
        description: 'Tax percentage',
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    tax_percentage?: number;

    @ApiPropertyOptional({
        example: 0.9,
        description: 'Tax amount',
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 4 })
    @Min(0)
    tax_amount?: number;

    @ApiPropertyOptional({
        maxLength: 1000,
        description: 'Additional remarks',
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    remarks?: string;
}
