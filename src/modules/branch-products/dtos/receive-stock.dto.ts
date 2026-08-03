import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString,
    IsDecimal,
    IsInt,
    IsOptional,
    IsString,
    MaxLength,
    Min,
} from 'class-validator';

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

    @ApiProperty({
        example: 100,
    })
    @IsInt()
    @Min(1)
    quantity!: number;
}
