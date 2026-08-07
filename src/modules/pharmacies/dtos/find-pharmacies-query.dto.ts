import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { PharmacyStatus } from '@gen/prisma/client';

import { BaseQueryDto } from '@/common/dtos';

export class FindPharmaciesQueryDto extends BaseQueryDto {
    @ApiPropertyOptional({
        enum: PharmacyStatus,
    })
    @IsOptional()
    @IsEnum(PharmacyStatus)
    status?: PharmacyStatus;
}
