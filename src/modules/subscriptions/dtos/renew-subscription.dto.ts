import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsBoolean, IsOptional } from 'class-validator';

export class RenewSubscriptionDto {
    @ApiPropertyOptional({
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    auto_renew?: boolean;
}
