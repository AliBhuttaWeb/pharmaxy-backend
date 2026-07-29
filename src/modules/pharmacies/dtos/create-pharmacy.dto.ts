import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreatePharmacyDto {
    @ApiProperty({
        example: 'ABC Pharmacy',
    })
    @IsString()
    @MaxLength(255)
    name!: string;

    @ApiPropertyOptional({
        example: 'ABC Pharmacy (Private) Limited',
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    legal_name?: string;

    @ApiPropertyOptional({
        example: 'REG-123456',
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    registration_number?: string;

    @ApiPropertyOptional({
        example: 'LIC-987654',
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    license_number!: string;

    @ApiPropertyOptional({
        example: 'NTN-1234567',
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    tax_number?: string;

    @ApiPropertyOptional({
        example: 'info@abcpharmacy.com',
    })
    @IsOptional()
    @IsEmail()
    @MaxLength(255)
    email?: string;

    @ApiPropertyOptional({
        example: '+923001234567',
    })
    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @ApiPropertyOptional({
        example: 'https://abcpharmacy.com',
    })
    @IsOptional()
    @IsUrl()
    @MaxLength(255)
    website?: string;

    @ApiPropertyOptional({
        example: 'https://cdn.example.com/logo.png',
    })
    @IsOptional()
    @IsUrl()
    logo_url?: string;
}
