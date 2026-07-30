import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRetailCategoryDto {
    @ApiProperty({
        example: 'Pain Relief',
        maxLength: 100,
    })
    @IsString()
    @MaxLength(100)
    name!: string;

    @ApiProperty({
        example: 'Pain killers and analgesics',
        required: false,
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;
}
