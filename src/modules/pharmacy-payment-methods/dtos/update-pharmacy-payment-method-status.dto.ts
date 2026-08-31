import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdatePharmacyPaymentMethodStatusDto {
    @ApiProperty({
        example: true,
    })
    @IsBoolean()
    is_active!: boolean;
}
