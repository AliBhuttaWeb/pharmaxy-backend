import { ApiProperty } from '@nestjs/swagger';

import { IsNumber, IsUUID, Min } from 'class-validator';

export class PosPaymentDto {
    @ApiProperty()
    @IsUUID()
    pharmacy_payment_method_id!: string;

    @ApiProperty({
        example: '500',
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(1)
    amount!: number;
}
