import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { SupplierStatus } from '@gen/prisma/client';

export class UpdateSupplierStatusDto {
    @ApiProperty({
        enum: SupplierStatus,
    })
    @IsEnum(SupplierStatus)
    status!: SupplierStatus;
}
