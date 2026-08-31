import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreatePharmacyPaymentMethodDto {
    @ApiProperty({
        example: '8a70a94d-198e-4a72-a5aa-fe7111a28d86',
    })
    @IsUUID()
    payment_method_id!: string;
}
