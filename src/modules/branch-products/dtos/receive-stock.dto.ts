import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString,
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
        example: 250,
    })
    @IsInt()
    @Min(0)
    purchase_price!: number;

    @ApiProperty({
        example: 300,
    })
    @IsInt()
    @Min(0)
    mrp!: number;

    @ApiProperty({
        example: 100,
    })
    @IsInt()
    @Min(1)
    quantity!: number;
}
