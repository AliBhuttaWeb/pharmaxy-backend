import { Type } from 'class-transformer';

import { ArrayMinSize, IsArray, IsOptional, IsUUID, Matches, ValidateNested } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PosItemDto, PosPaymentDto } from '.';

export class CreatePosSaleDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    customer_id?: string;

    @ApiPropertyOptional()
    @IsOptional()
    customer_name?: string;

    @ApiPropertyOptional({
        example: '+923124700700',
    })
    @IsOptional()
    @Matches(/^\+\d{2,}\d{5,}$/, {
        message: 'customer_phone must be a valid phone number with country code',
    })
    customer_phone?: string;

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

    @ApiPropertyOptional()
    @IsOptional()
    hold_order_id?: string;
}
