import { PaginationQueryDto } from '@/common/pagination';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class DosageFormQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({
        description: 'Filter by soft-deleted status (true for deleted only, false for active only). Defaults to false.',
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
