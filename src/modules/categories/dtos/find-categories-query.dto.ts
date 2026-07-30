import {
    ApiPropertyOptional,
} from '@nestjs/swagger';
import {
    IsOptional,
    IsUUID,
} from 'class-validator';

import { BaseQueryDto } from '@/common/dtos';

export class FindCategoriesQueryDto extends BaseQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    parent_id?: string;
}