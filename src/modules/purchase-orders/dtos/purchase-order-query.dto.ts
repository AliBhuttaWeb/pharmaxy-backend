import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';

import { PurchaseOrderStatus } from '@gen/prisma/client';
import { PaginationQueryDto } from '@/common/pagination';

export class PurchaseOrderQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    branch_id?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    supplier_id?: string;

    @ApiPropertyOptional({
        enum: PurchaseOrderStatus,
    })
    @IsOptional()
    @IsEnum(PurchaseOrderStatus)
    status?: PurchaseOrderStatus;

    @ApiPropertyOptional({
        example: '2026-08-01',
    })
    @IsOptional()
    @IsDateString()
    from_date?: string;

    @ApiPropertyOptional({
        example: '2026-08-31',
    })
    @IsOptional()
    @IsDateString()
    to_date?: string;
}
