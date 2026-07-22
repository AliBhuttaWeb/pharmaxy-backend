import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { SWAGGER as AUTH_SWAGGER } from '../constants/swagger.constants';

export class RefreshTokenDto {
    @ApiProperty({
        description: AUTH_SWAGGER.AUTH.REFRESH_TOKEN_DESCRIPTION,
        example: AUTH_SWAGGER.AUTH.REFRESH_TOKEN_EXAMPLE,
    })
    @IsString()
    @IsNotEmpty()
    refreshToken!: string;
}
