import { Type } from 'class-transformer';

import { ArrayMinSize, IsArray, IsUUID, ValidateNested } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { ReceivePurchaseOrderBatchDto } from './receive-purchase-order-batch.dto';

export class ReceivePurchaseOrderItemDto {
    @ApiProperty()
    @IsUUID()
    purchase_order_item_id!: string;

    @ApiProperty({
        type: ReceivePurchaseOrderBatchDto,
        isArray: true,
    })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({
        each: true,
    })
    @Type(() => ReceivePurchaseOrderBatchDto)
    batches!: ReceivePurchaseOrderBatchDto[];
}
