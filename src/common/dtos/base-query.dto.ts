import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min, IsUUID } from 'class-validator';

export class BaseQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    search?: string;

    @IsOptional()
    @IsString()
    sort_by?: string;

    @IsOptional()
    @IsIn(['asc', 'desc'])
    sort_order?: 'asc' | 'desc';

    @IsOptional()
    @IsUUID()
    pharmacy_id?: string;

    @IsOptional()
    @IsUUID()
    branch_id?: string;
}
