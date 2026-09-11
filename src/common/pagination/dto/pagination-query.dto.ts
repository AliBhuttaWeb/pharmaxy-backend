import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class PaginationQueryDto {
    @ApiPropertyOptional({ description: 'Page number (starts from 1)' })
    @IsOptional()
    @Transform(({ value }) => (value !== undefined && value !== null && value !== '' ? Number(value) : undefined))
    @IsInt()
    @Min(1)
    page?: number;

    @ApiPropertyOptional({ description: 'Number of records per page' })
    @IsOptional()
    @Transform(({ value }) => (value !== undefined && value !== null && value !== '' ? Number(value) : undefined))
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number;

    @ApiPropertyOptional({ description: 'Search term' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Sort field' })
    @IsOptional()
    @IsString()
    sort_by?: string;

    @ApiPropertyOptional({ enum: ['asc', 'desc'], description: 'Sort order' })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    sort_order?: 'asc' | 'desc';

    @ApiPropertyOptional({ description: 'Filter by pharmacy ID' })
    @IsOptional()
    @IsUUID()
    pharmacy_id?: string;

    @ApiPropertyOptional({ description: 'Filter by branch ID' })
    @IsOptional()
    @IsUUID()
    branch_id?: string;
}
