import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class BranchProductFieldsDto {
    @ApiProperty()
    @IsUUID()
    product_id!: string;

    @ApiProperty({
        example: 2.5,
    })
    @IsNumber({ maxDecimalPlaces: 4 })
    @Min(0.0001)
    selling_price!: number;

    @ApiPropertyOptional({
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    is_controlled_drug?: boolean;

    @ApiPropertyOptional({
        maxLength: 1000,
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    storage_instructions?: string;

    @ApiPropertyOptional({
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
