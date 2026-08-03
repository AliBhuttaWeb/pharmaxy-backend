import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import {
    IsDateString,
    IsInt,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    MaxLength,
    Min,
} from 'class-validator';

export class CreateInitialProductBatchDto {
    @ApiProperty({
        example: 'BATCH-001',
    })
    @IsString()
    @MaxLength(100)
    batch_number!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    manufacturing_date?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    expiry_date?: Date;

    @ApiProperty({
        example: 120,
    })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    purchase_price!: number;

    @ApiProperty({
        example: 150,
    })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    mrp!: number;

    @ApiProperty({
        example: 100,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    quantity!: number;
}
