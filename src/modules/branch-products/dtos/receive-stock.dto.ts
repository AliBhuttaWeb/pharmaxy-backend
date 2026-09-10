import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class ReceiveStockDto {
    @ApiProperty({
        example: 'BATCH-001',
    })
    @IsString()
    @MaxLength(100)
    batch_number!: string;

    @ApiPropertyOptional({
        example: '2026-01-01',
    })
    @IsOptional()
    @IsDateString()
    manufacturing_date?: string;

    @ApiPropertyOptional({
        example: '2028-01-01',
    })
    @IsOptional()
    @IsDateString()
    expiry_date?: string;

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

    @ApiProperty({
        example: 100,
    })
    @IsInt()
    @Min(1)
    quantity!: number;
}
