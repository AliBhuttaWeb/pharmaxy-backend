import { ApiPropertyOptional } from '@nestjs/swagger';

import {
    IsArray,
    IsBoolean,
    IsEmail,
    IsOptional,
    IsPhoneNumber,
    IsString,
    IsUUID,
    MaxLength,
} from 'class-validator';

export class UpdateUserDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(100)
    first_name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(100)
    last_name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    @MaxLength(255)
    email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    avatar_url?: string;

    @ApiPropertyOptional({
        description: 'Optional role ID to reassign user role',
    })
    @IsOptional()
    @IsUUID()
    role_id?: string;

    @ApiPropertyOptional({
        description: 'Optional permission override IDs for the user',
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    permission_ids?: string[];

    @ApiPropertyOptional({
        description: 'Flag indicating whether permission overrides were modified',
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    permissions_modified?: boolean;
}
