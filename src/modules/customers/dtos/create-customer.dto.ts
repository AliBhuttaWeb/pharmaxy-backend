import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

import { Gender } from '@prisma/client';

export class CreateCustomerDto {
    @IsString()
    @MaxLength(100)
    first_name!: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    last_name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(30)
    phone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    @MaxLength(255)
    email?: string;

    @ApiPropertyOptional({
        enum: Gender,
    })
    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;

    @IsOptional()
    @IsDateString()
    date_of_birth?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    city?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    state?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    country?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    postal_code?: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    is_walk_in?: boolean;
}
