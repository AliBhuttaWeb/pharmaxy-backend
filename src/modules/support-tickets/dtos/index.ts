import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SupportTicketStatus } from '@gen/prisma/client';

export class SupportTicketQueryDto {
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

    @ApiPropertyOptional({ enum: SupportTicketStatus })
    @IsOptional()
    @IsEnum(SupportTicketStatus)
    status?: SupportTicketStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string;
}

export class CreateSupportTicketDto {
    @ApiProperty({ example: 'Dispensing Machine Error' })
    @IsString()
    subject!: string;

    @ApiPropertyOptional({ example: 'Unit 4B keeps timing out during dispense' })
    @IsOptional()
    @IsString()
    message?: string;
}

export class UpdateSupportTicketStatusDto {
    @ApiProperty({ enum: SupportTicketStatus })
    @IsEnum(SupportTicketStatus)
    status!: SupportTicketStatus;
}
