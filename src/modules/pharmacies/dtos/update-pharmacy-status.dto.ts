import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { PharmacyStatus } from '@prisma/client';

export class UpdatePharmacyStatusDto {
    @ApiProperty({
        enum: PharmacyStatus,
    })
    @IsEnum(PharmacyStatus)
    status!: PharmacyStatus;
}
