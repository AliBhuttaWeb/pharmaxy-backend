import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDecimal, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateBranchProductDto {
    @ApiProperty()
    @IsUUID()
    branch_id!: string;

    @ApiProperty()
    @IsUUID()
    product_id!: string;

    @ApiProperty({
        example: '250.00',
    })
    @IsDecimal({
        decimal_digits: '0,2',
    })
    selling_price!: string;

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
