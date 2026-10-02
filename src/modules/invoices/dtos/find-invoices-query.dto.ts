import { PaginationQueryDto } from '@/common/pagination';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { InvoiceStatus } from '@gen/prisma/enums';

export class FindInvoicesQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({ enum: InvoiceStatus })
    @IsOptional()
    @IsEnum(InvoiceStatus)
    status?: InvoiceStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    customer_id?: string;
}
