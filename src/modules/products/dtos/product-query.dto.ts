import { PaginationQueryDto } from '@/common/pagination';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class ProductQueryDto extends PaginationQueryDto {
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

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    requires_prescription?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    is_active?: boolean;
}
