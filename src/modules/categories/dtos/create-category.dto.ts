import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({
        example: 'Medicines',
        maxLength: 150,
    })
    @IsString()
    @MaxLength(150)
    name!: string;

    @ApiProperty({
        example: 'Prescription and OTC pharmaceuticals',
        required: false,
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;
}
