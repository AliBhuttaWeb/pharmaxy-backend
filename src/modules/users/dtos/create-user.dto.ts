import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '@prisma/enums';

import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsPhoneNumber,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
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

    @ApiPropertyOptional({
        enum: UserStatus,
        default: UserStatus.ACTIVE,
    })
    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;
}
