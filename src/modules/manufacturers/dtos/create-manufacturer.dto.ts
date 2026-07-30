import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateManufacturerDto {
    @ApiProperty()
    @IsString()
    @MaxLength(200)
    name!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;
}
