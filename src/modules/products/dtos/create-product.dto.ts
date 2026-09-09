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

    @ApiProperty({
        example: 'Paracetamol',
        maxLength: 255,
    })
    @IsString()
    @MaxLength(255)
    generic_name!: string;

    @ApiProperty()
    @IsUUID()
    manufacturer_id!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    product_type_id?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    retail_category_id?: string;

    @ApiProperty()
    @IsUUID()
    dosage_form_id!: string;

    @ApiProperty({
        example: '500mg',
        maxLength: 100,
    })
    @IsString()
    @MaxLength(100)
    strength!: string;

    @ApiProperty({
        example: 10,
    })
    @IsInt()
    @Min(1)
    pack_quantity!: number;

    @ApiProperty({
        example: 'Tablet',
        maxLength: 50,
    })
    @IsString()
    @MaxLength(50)
    pack_unit!: string;

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
