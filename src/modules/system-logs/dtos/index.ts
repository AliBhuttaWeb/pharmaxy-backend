import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SystemLogLevel, SystemLogSource } from '@gen/prisma/client';

export class SystemLogQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;

    @ApiPropertyOptional({ enum: SystemLogLevel })
    @IsOptional()
    @IsEnum(SystemLogLevel)
    level?: SystemLogLevel;

    @ApiPropertyOptional({ enum: SystemLogSource })
    @IsOptional()
    @IsEnum(SystemLogSource)
    source?: SystemLogSource;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string;
}
