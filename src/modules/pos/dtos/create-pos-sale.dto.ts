import { Type } from 'class-transformer';

import { ArrayMinSize, IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PosItemDto, PosPaymentDto } from '.';

export class CreatePosSaleDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    customer_id?: string;

    @ApiProperty({
        type: PosItemDto,
        isArray: true,
    })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({
        each: true,
    })
    @Type(() => PosItemDto)
    items!: PosItemDto[];

    @ApiProperty({
        type: PosPaymentDto,
        isArray: true,
    })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({
        each: true,
    })
    @Type(() => PosPaymentDto)
    payments!: PosPaymentDto[];

    @ApiPropertyOptional()
    @IsOptional()
    notes?: string;
}
