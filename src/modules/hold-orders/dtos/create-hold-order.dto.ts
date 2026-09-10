import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsString, IsArray, ArrayMinSize, IsObject } from 'class-validator';
import { CreateHoldOrderItemDto } from './create-hold-order-item.dto';
import { Type } from 'class-transformer';

export class CreateHoldOrderDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    customer_id?: string;

    @ApiProperty({
        type: [CreateHoldOrderItemDto],
    })
    @IsArray()
    @ArrayMinSize(1)
    @IsObject({ each: true })
    @Type(() => CreateHoldOrderItemDto)
    items!: CreateHoldOrderItemDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string;
}
