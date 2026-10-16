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

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    branch_id?: string;
}

export class CreateSupportTicketDto {
    @ApiProperty({ example: 'Dispensing Machine Error' })
    @IsString()
    subject!: string;

    @ApiPropertyOptional({ example: 'Unit 4B keeps timing out during dispense' })
    @IsOptional()
    @IsString()
    message?: string;

    @ApiPropertyOptional({ example: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
    @IsOptional()
    @IsString()
    branch_id?: string;
}

export class UpdateSupportTicketStatusDto {
    @ApiProperty({ enum: SupportTicketStatus })
    @IsEnum(SupportTicketStatus)
    status!: SupportTicketStatus;
}
