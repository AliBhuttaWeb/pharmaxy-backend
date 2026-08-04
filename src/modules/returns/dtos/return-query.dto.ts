import { PaginationQueryDto } from '@/common/pagination';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsUUID } from 'class-validator';

export class ReturnQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    invoice_id?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    customer_id?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    cashier_id?: string;
}
