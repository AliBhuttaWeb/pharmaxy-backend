import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '@gen/prisma/enums';

import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsOptional,
    IsPhoneNumber,
    IsString,
    IsUUID,
    MaxLength,
    MinLength,
} from 'class-validator';

export class QuickCreateUserDto {
    @ApiProperty()
    @IsString()
    @MaxLength(100)
    first_name!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(100)
    last_name?: string;

    @ApiProperty()
    @IsEmail()
    @MaxLength(255)
    email!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @ApiProperty()
    @IsString()
    @MinLength(8)
    @MaxLength(255)
    password!: string;

    @ApiProperty({
        description: 'Role ID to assign to the user',
    })
    @IsUUID()
    role_id!: string;

    @ApiPropertyOptional({
        enum: UserStatus,
        default: UserStatus.ACTIVE,
    })
    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;

    @ApiPropertyOptional({
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    is_email_verified?: boolean;

    @ApiPropertyOptional({
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    is_phone_verified?: boolean;
}
