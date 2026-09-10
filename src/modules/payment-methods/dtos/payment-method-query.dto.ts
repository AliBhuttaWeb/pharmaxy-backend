import { PaginationQueryDto } from '@/common/pagination';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethodType } from '@gen/prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class PaymentMethodQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({ enum: PaymentMethodType })
    @IsOptional()
    @IsEnum(PaymentMethodType)
    type?: PaymentMethodType;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    is_active?: boolean;
}
