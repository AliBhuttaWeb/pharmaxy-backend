import { NearbyReservationStatus } from '@gen/prisma/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateNearbyReservationStatusDto {
    @ApiProperty({
        enum: NearbyReservationStatus,
        description: 'New status for the reservation (CONFIRMED, COMPLETED, CANCELLED)',
    })
    @IsEnum(NearbyReservationStatus)
    status!: NearbyReservationStatus;

    @ApiPropertyOptional({
        description: 'Optional notes when updating status',
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    notes?: string;
}
