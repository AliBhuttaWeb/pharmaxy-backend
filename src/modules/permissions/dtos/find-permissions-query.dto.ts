import { PaginationQueryDto } from '@/common/pagination';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindPermissionsQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({
        description: 'Filter permissions by module.',
        example: 'Users',
    })
    @IsOptional()
    @IsString()
    module?: string;
}
