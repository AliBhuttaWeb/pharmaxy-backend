import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional } from 'class-validator';

import { BaseQueryDto } from '@/common/dtos';
import { UserStatus } from '@gen/prisma/enums';

export class FindUsersQueryDto extends BaseQueryDto {
    @ApiPropertyOptional({
        enum: UserStatus,
    })
    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;
}
