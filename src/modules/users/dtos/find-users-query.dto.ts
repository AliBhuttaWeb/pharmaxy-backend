import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional } from 'class-validator';

import { PaginationQueryDto } from '@/common/pagination';
import { UserStatus } from '@gen/prisma/enums';

export class FindUsersQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({
        enum: UserStatus,
    })
    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus;
}
