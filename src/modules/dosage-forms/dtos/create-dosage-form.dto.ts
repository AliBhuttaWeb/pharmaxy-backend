import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDosageFormDto {
    @ApiProperty({
        example: 'Tablet',
        maxLength: 100,
    })
    @IsString()
    @MaxLength(100)
    name!: string;

    @ApiProperty({
        example: 'Solid oral dosage form',
        required: false,
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;
}
