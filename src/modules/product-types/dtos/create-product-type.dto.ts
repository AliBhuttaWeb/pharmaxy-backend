import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProductTypeDto {
    @ApiProperty({
        example: 'Medicine',
        maxLength: 100,
    })
    @IsString()
    @MaxLength(100)
    name!: string;

    @ApiProperty({
        example: 'Prescription and over-the-counter medicines',
        required: false,
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;
}