import { PaginationQueryDto } from '@/common/pagination';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class NearbyInventoriesQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({
        description: 'Filter by specific product ID',
    })
    @IsOptional()
    @IsUUID()
    product_id?: string;

    @ApiPropertyOptional({
        description: 'Filter by generic name (formula)',
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    generic_name?: string;

    @ApiPropertyOptional({
        description: 'Filter by dosage form ID',
    })
    @IsOptional()
    @IsUUID()
    dosage_form_id?: string;

    @ApiPropertyOptional({
        description: 'Filter by category ID',
    })
    @IsOptional()
    @IsUUID()
    category_id?: string;

    @ApiPropertyOptional({
        description: 'Filter by branch city',
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    city?: string;

    @ApiPropertyOptional({
        description: 'Search radius in kilometers (applied when coordinates are available)',
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0.1)
    radius?: number;

    @ApiPropertyOptional({
        description: 'Optional caller latitude (falls back to active branch latitude)',
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    latitude?: number;

    @ApiPropertyOptional({
        description: 'Optional caller longitude (falls back to active branch longitude)',
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    longitude?: number;
}
