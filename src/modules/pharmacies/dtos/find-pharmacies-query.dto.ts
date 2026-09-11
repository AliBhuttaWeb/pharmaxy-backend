import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { PharmacyStatus } from '@gen/prisma/client';

import { PaginationQueryDto } from '@/common/pagination';

export class FindPharmaciesQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({
        enum: PharmacyStatus,
    })
    @IsOptional()
    @IsEnum(PharmacyStatus)
    status?: PharmacyStatus;
}
