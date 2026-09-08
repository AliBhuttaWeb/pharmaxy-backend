import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateHoldOrderItemDto {
    @ApiProperty()
    @IsUUID()
    branch_product_id!: string;

    @ApiProperty({
        example: 2,
    })
    @IsInt()
    @Min(1)
    quantity!: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string;
}
