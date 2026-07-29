import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

import { BaseQueryDto } from '@/common/dtos';
import { SupplierStatus } from '@prisma/client';

export class FindSuppliersQueryDto extends BaseQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    pharmacy_id?: string;

    @ApiPropertyOptional({
        enum: SupplierStatus,
    })
    @IsOptional()
    @IsEnum(SupplierStatus)
    status?: SupplierStatus;
}
