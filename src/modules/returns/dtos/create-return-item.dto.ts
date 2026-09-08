import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class CreateReturnItemDto {
    @ApiProperty()
    @IsUUID()
    invoice_item_id!: string;

    @ApiProperty({
        example: 2,
    })
    @IsInt()
    @Min(1)
    quantity!: number;
}
