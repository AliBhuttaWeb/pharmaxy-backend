import { PaginationQueryDto } from '@/common/pagination';
import { NearbyReservationStatus } from '@gen/prisma/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsIn, IsOptional, IsUUID } from 'class-validator';
import { RESERVATION_DIRECTION, type ReservationDirection } from '../constants';

export class NearbyReservationsQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({
        enum: Object.values(RESERVATION_DIRECTION),
        default: RESERVATION_DIRECTION.ALL,
        description:
            'OUTGOING = items reserved by your branch from other stores; INCOMING = items reserved from your store by other branches; ALL = both',
    })
    @IsOptional()
    @IsIn(Object.values(RESERVATION_DIRECTION))
    direction?: ReservationDirection;

    @ApiPropertyOptional({
        enum: NearbyReservationStatus,
        description: 'Filter by reservation status',
    })
    @IsOptional()
    @IsEnum(NearbyReservationStatus)
    status?: NearbyReservationStatus;

    @ApiPropertyOptional({
        description: 'Filter by branch product ID',
    })
    @IsOptional()
    @IsUUID()
    branch_product_id?: string;

    @ApiPropertyOptional({
        description: 'Filter by requesting (source) branch ID',
    })
    @IsOptional()
    @IsUUID()
    requesting_branch_id?: string;

    @ApiPropertyOptional({
        description: 'Filter by target (holding) branch ID',
    })
    @IsOptional()
    @IsUUID()
    target_branch_id?: string;
}
