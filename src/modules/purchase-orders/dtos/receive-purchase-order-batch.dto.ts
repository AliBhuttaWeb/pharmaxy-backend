import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

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

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    manufacturing_date?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    expiry_date?: string;
}
