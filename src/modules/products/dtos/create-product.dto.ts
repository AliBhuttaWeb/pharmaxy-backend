import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    Min,
    IsInt,
    IsUrl,
} from 'class-validator';

export class CreateProductDto {
    @ApiProperty({
        example: 'Panadol 500mg',
        maxLength: 255,
    })
    @IsString()
    @MaxLength(255)
    name!: string;

    @ApiPropertyOptional({
        example: 'Paracetamol',
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    generic_name?: string;

    @ApiPropertyOptional({
        example: 'Paracetamol 500mg',
        maxLength: 1000,
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    formula?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    manufacturer_id?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    product_type_id?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    retail_category_id?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    dosage_form_id?: string;

    @ApiPropertyOptional({
        example: '500mg',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    strength?: string;

    @ApiPropertyOptional({
        example: 10,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    pack_quantity?: number;

    @ApiPropertyOptional({
        example: 'Tablet',
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    pack_unit?: string;

    @ApiPropertyOptional({
        example: '8964001234567',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    barcode?: string;

    @ApiPropertyOptional({
        example: 'https://cdn.example.com/products/panadol.png',
    })
    @IsOptional()
    @IsUrl()
    image_url?: string;

    @ApiPropertyOptional({
        example: 'Pain relief medicine.',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    requires_prescription?: boolean;

    @ApiPropertyOptional({
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
