import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateBranchProductDto {
    @ApiProperty()
    @IsUUID()
    product_id!: string;

    @ApiProperty({
        example: 250,
    })
    @IsInt()
    @Min(0)
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
