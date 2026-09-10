import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class ReceivePurchaseOrderBatchDto {
    @ApiProperty()
    @IsString()
    @MaxLength(100)
    batch_number!: string;

    @ApiProperty({
        example: 100,
    })
    @IsInt()
    @Min(1)
    received_quantity!: number;

    @ApiProperty({
        example: 2.5,
    })
    @IsNumber({ maxDecimalPlaces: 4 })
    @Min(0.0001)
    purchase_price!: number;

    @ApiProperty({
        example: 3.0,
    })
    @IsNumber({ maxDecimalPlaces: 4 })
    @Min(0.0001)
    mrp!: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    manufacturing_date?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    expiry_date?: string;
}
