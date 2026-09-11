import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

import { PaginationQueryDto } from '@/common/pagination';
import { SupplierStatus } from '@gen/prisma/client';

export class FindSuppliersQueryDto extends PaginationQueryDto {

    @ApiPropertyOptional({
        enum: SupplierStatus,
    })
    @IsOptional()
    @IsEnum(SupplierStatus)
    status?: SupplierStatus;
}
