import { ApiProperty } from '@nestjs/swagger';

import { IsDecimal, IsUUID } from 'class-validator';

export class PosPaymentDto {
    @ApiProperty()
    @IsUUID()
    payment_method_id!: string;

    @ApiProperty({
        example: '500',
    })
    @IsDecimal({
        decimal_digits: '0,2',
    })
    amount!: string;
}
