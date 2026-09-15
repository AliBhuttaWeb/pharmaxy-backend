import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleScope, UserStatus } from '@gen/prisma/enums';

import {
    IsArray,
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

    @ApiPropertyOptional({
        description: 'Optional pharmacy ID for Super Admin creation context',
    })
    @IsOptional()
    @IsUUID()
    pharmacy_id?: string;

    @ApiPropertyOptional({
        description: 'Optional pharmacy branch ID for Super Admin creation context',
    })
    @IsOptional()
    @IsUUID()
    branch_id?: string;

    @ApiProperty({
        enum: RoleScope,
        description: 'Scope of the user role.',
    })
    @IsEnum(RoleScope)
    role_scope!: RoleScope;

    @ApiProperty({
        description: 'Role ID to assign to the user',
    })
    @IsUUID()
    role_id!: string;

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
