import { PaginationQueryDto } from '@/common/pagination';

import { IsOptional, IsString } from 'class-validator';

export class CustomerQueryDto extends PaginationQueryDto {
    @IsOptional()
    is_active?: boolean;

    @IsOptional()
    is_walk_in?: boolean;
}
