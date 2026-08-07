import { SIGNUP_SCOPES } from '@/common/constants';
import { BaseQueryDto } from '@/common/dtos';
import type { SignupScope } from '@/common/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class FindRolesQueryDto extends BaseQueryDto {
    @ApiPropertyOptional({
        enum: SIGNUP_SCOPES,
        description: 'Filter roles available for the specified signup scope.',
        example: SIGNUP_SCOPES.CONSOLE,
    })
    @IsOptional()
    @IsEnum(SIGNUP_SCOPES)
    signup_scope?: SignupScope;
}
