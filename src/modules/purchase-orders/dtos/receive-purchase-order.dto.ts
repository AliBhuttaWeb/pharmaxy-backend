import { Type } from 'class-transformer';

import {
    ArrayMinSize,
    IsArray,
    IsOptional,
    IsString,
    MaxLength,
    ValidateNested,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ReceivePurchaseOrderItemDto } from './receive-purchase-order-item.dto';

export class ReceivePurchaseOrderDto {
    @ApiPropertyOptional({
        maxLength: 5000,
    })
    @IsOptional()
    @IsString()
    @MaxLength(5000)
    receiver_notes?: string;

    @ApiProperty({
        type: ReceivePurchaseOrderItemDto,
        isArray: true,
    })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({
        each: true,
    })
    @Type(() => ReceivePurchaseOrderItemDto)
    items!: ReceivePurchaseOrderItemDto[];
}
