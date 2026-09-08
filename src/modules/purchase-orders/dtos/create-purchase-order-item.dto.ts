import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

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
        example: 250,
        description: 'Unit purchase cost',
    })
    @IsInt()
    @Min(1)
    unit_cost!: number;

    @ApiPropertyOptional({
        example: 5,
        description: 'Discount percentage',
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    discount_percentage?: number;

    @ApiPropertyOptional({
        example: 500,
        description: 'Discount amount',
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    discount_amount?: number;

    @ApiPropertyOptional({
        example: 18,
        description: 'Tax percentage',
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    tax_percentage?: number;

    @ApiPropertyOptional({
        example: 900,
        description: 'Tax amount',
    })
    @IsOptional()
    @IsInt()
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
