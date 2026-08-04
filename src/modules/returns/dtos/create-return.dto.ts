import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { CreateReturnItemDto } from './create-return-item.dto';

export class CreateReturnDto {
    @ApiProperty()
    @IsUUID()
    invoice_id!: string;

    @ApiProperty({
        type: [CreateReturnItemDto],
    })
    @IsArray()
    @ValidateNested({
        each: true,
    })
    @Type(() => CreateReturnItemDto)
    items!: CreateReturnItemDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    reason?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    notes?: string;
}
