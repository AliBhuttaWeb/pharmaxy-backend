import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

/**
 * The branch_product sub-object within the create branch product request.
 * product_id is optional — it is resolved internally when a new product
 * is being created from scratch via the top-level `product` field.
 */
export class CreateBranchProductItemDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    product_id?: string;

    @ApiProperty({
        example: 250,
    })
    @IsInt()
    @Min(1)
    selling_price!: number;

    @ApiPropertyOptional({
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    is_controlled_drug?: boolean;

    @ApiPropertyOptional({
        maxLength: 1000,
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    storage_instructions?: string;

    @ApiPropertyOptional({
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
