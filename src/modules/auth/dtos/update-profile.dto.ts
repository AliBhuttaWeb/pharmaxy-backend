import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
    @ApiPropertyOptional({ example: 'John' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    first_name?: string;

    @ApiPropertyOptional({ example: 'Doe' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    last_name?: string;

    @ApiPropertyOptional({ example: '+923001234567' })
    @IsOptional()
    @IsString()
    @MaxLength(30)
    phone?: string;

    @ApiPropertyOptional({ example: 'https://example.com/avatar.png' })
    @IsOptional()
    @IsString()
    avatar_url?: string;
}
