import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class DashboardQueryDto {
    @ApiPropertyOptional({
        description: 'Number of days for sales trend and chart data (default: 7, min: 1). Max days is governed by the pharmacy active subscription plan.',
        default: 7,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    days?: number = 7;
}
