import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDecimal, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateHoldOrderItemDto {
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

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string;
}
