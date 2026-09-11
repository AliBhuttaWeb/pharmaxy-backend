import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

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

    @ApiPropertyOptional({
        description: 'Filter by soft-deleted status (true for deleted only, false for active only). Omit to get all.',
        example: false,
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true' || value === true) return true;
        if (value === 'false' || value === false) return false;
        return undefined;
    })
    @IsBoolean()
    is_deleted?: boolean;
}
