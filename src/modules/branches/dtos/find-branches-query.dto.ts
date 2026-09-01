import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsUUID } from 'class-validator';

import { BaseQueryDto } from '@/common/dtos';

export class FindBranchesQueryDto extends BaseQueryDto {
    @ApiPropertyOptional({
        description: 'Filter by pharmacy.',
    })
    @IsOptional()
    @IsUUID()
    declare pharmacy_id?: string;

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
