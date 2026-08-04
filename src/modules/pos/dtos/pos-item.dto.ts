import { ApiProperty } from '@nestjs/swagger';

import { IsDecimal, IsUUID } from 'class-validator';

export class PosItemDto {
    @ApiProperty()
    @IsUUID()
    branch_product_id!: string;

    @ApiProperty({
        example: '2',
    })
    @IsDecimal({
        decimal_digits: '0,3',
    })
    quantity!: string;
}
