import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsUUID } from 'class-validator';

export class CreateReturnItemDto {
    @ApiProperty()
    @IsUUID()
    invoice_item_id!: string;

    @ApiProperty({
        example: '2.000',
    })
    @IsDecimal({
        decimal_digits: '0,3',
    })
    quantity!: string;
}
