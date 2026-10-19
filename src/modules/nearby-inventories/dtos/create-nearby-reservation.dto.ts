import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDateString,
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    Min,
} from 'class-validator';

export class CreateNearbyReservationDto {
    @ApiProperty({
        description: 'Target branch_product_id from the nearby store to reserve',
    })
    @IsUUID()
    branch_product_id!: string;

    @ApiPropertyOptional({
        description:
            'Optional specific product_batch_id at the target branch (auto-selected by earliest expiry if omitted)',
    })
    @IsOptional()
    @IsUUID()
    product_batch_id?: string;

    @ApiProperty({
        description: 'Quantity to reserve from the target branch',
        minimum: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    quantity!: number;

    @ApiPropertyOptional({
        description: 'Explicit reservation expiry ISO timestamp',
    })
    @IsOptional()
    @IsDateString()
    expires_at?: string;

    @ApiPropertyOptional({
        description:
            'Duration in minutes until reservation expires (used if expires_at is not provided, defaults to 120 minutes)',
        minimum: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    expires_in_minutes?: number;

    @ApiPropertyOptional({
        description: 'Customer name for whom the item is reserved',
        maxLength: 150,
    })
    @IsOptional()
    @IsString()
    @MaxLength(150)
    customer_name?: string;

    @ApiPropertyOptional({
        description: 'Customer phone number',
        maxLength: 30,
    })
    @IsOptional()
    @IsString()
    @MaxLength(30)
    customer_phone?: string;

    @ApiPropertyOptional({
        description: 'Additional reservation notes or instructions',
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    notes?: string;
}
