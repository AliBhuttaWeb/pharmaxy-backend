import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsDecimal, IsOptional, IsString, MaxLength } from 'class-validator';

export class ReceivePurchaseOrderBatchDto {
    @ApiProperty()
    @IsString()
    @MaxLength(100)
    batch_number!: string;

    @ApiProperty({
        example: '100',
    })
    @IsDecimal({
        decimal_digits: '0,3',
    })
    received_quantity!: number;

    @ApiProperty({
        example: '250.00',
    })
    @IsDecimal({
        decimal_digits: '0,2',
    })
    purchase_price!: string;

    @ApiProperty({
        example: '300.00',
    })
    @IsDecimal({
        decimal_digits: '0,2',
    })
    mrp!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    manufacturing_date?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    expiry_date?: string;
}
