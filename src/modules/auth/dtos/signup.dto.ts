import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { SWAGGER } from '../constants';
import type { SignupScope } from '@/common/types';

export class SignupDto {
    @ApiProperty({
        description: SWAGGER.AUTH.FIRST_NAME_DESCRIPTION,
        example: SWAGGER.AUTH.FIRST_NAME_EXAMPLE,
    })
    @IsString()
    @IsNotEmpty()
    first_name!: string;

    @ApiPropertyOptional({
        description: SWAGGER.AUTH.LAST_NAME_DESCRIPTION,
        example: SWAGGER.AUTH.LAST_NAME_EXAMPLE,
    })
    @IsOptional()
    @IsString()
    last_name?: string;

    @ApiProperty({
        description: SWAGGER.AUTH.EMAIL_DESCRIPTION,
        example: SWAGGER.AUTH.EMAIL_EXAMPLE,
    })
    @IsEmail()
    email!: string;

    @ApiPropertyOptional({
        description: SWAGGER.AUTH.PHONE_DESCRIPTION,
        example: SWAGGER.AUTH.PHONE_EXAMPLE,
    })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({
        description: SWAGGER.AUTH.PASSWORD_DESCRIPTION,
        example: SWAGGER.AUTH.PASSWORD_EXAMPLE,
    })
    @IsString()
    @IsNotEmpty()
    password!: string;

    @ApiProperty({
        description: SWAGGER.AUTH.ROLE_ID_DESCRIPTION,
        example: SWAGGER.AUTH.ROLE_ID_EXAMPLE,
    })
    @IsUUID()
    role_id!: string;

    @ApiProperty({
        description: SWAGGER.AUTH.SIGNUP_SCOPE_DESCRIPTION,
        example: SWAGGER.AUTH.SIGNUP_SCOPE_EXAMPLE,
    })
    @IsString()
    @IsNotEmpty()
    signup_scope!: SignupScope;
}
