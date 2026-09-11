import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsUUID } from 'class-validator';

import { PaginationQueryDto } from '@/common/pagination';

export class FindBranchesQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({
        description: 'Filter by active status.',
        example: true,
    })
    @IsOptional()
    @IsBooleanString()
    is_active?: string;

    @ApiPropertyOptional({
        description: 'Filter main branch.',
        example: true,
    })
    @IsOptional()
    @IsBooleanString()
    is_main?: string;
}
