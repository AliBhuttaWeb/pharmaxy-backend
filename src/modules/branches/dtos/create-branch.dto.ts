import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEmail,
    IsLatitude,
    IsLongitude,
    IsOptional,
    IsPhoneNumber,
    IsString,
    IsUUID,
    MaxLength,
} from 'class-validator';

export class CreateBranchDto {
    @ApiProperty()
    @IsUUID()
    pharmacy_id!: string;

    @ApiProperty()
    @IsString()
    @MaxLength(255)
    name!: string;

    @ApiProperty()
    @IsString()
    address!: string;

    @ApiProperty()
    @IsString()
    @MaxLength(100)
    city!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(100)
    state?: string;

    @ApiProperty()
    @IsString()
    @MaxLength(100)
    country!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(20)
    postal_code?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsLatitude()
    latitude?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsLongitude()
    longitude?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @ApiPropertyOptional({
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    is_main?: boolean;
}
