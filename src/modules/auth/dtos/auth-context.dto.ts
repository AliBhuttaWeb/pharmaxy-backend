import { ApiProperty } from '@nestjs/swagger';
import { PharmacyStatus, SubscriptionStatus } from '@prisma/client';
import { AuthenticatedRole } from '../types';
import { LoginUserDto } from './login-user.dto';

export class PharmacyContextDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty({ nullable: true })
    logoUrl!: string | null;

    @ApiProperty({ enum: PharmacyStatus })
    status!: PharmacyStatus;
}

export class BranchContextDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty({ nullable: true })
    address!: string | null;

    @ApiProperty()
    isMain!: boolean;
}

export class SubscriptionCapabilityDto {
    @ApiProperty({ enum: SubscriptionStatus })
    status!: SubscriptionStatus;

    @ApiProperty()
    planName!: string;

    @ApiProperty()
    expiresAt!: Date;

    @ApiProperty({ nullable: true })
    maxBranches!: number | null;

    @ApiProperty({ nullable: true })
    maxUsers!: number | null;

    @ApiProperty()
    allowQuickSale!: boolean;

    @ApiProperty()
    allowNearbyInventory!: boolean;

    @ApiProperty({ nullable: true })
    reportHistoryMonths!: number | null;
}

export class AuthContextDto {
    @ApiProperty({ type: LoginUserDto })
    user!: LoginUserDto;

    @ApiProperty({ type: PharmacyContextDto, nullable: true })
    pharmacy!: PharmacyContextDto | null;

    @ApiProperty({ type: BranchContextDto, nullable: true })
    activeBranch!: BranchContextDto | null;

    @ApiProperty({ type: () => [BranchContextDto] })
    availableBranches!: BranchContextDto[];

    @ApiProperty({ type: () => [AuthenticatedRole] })
    roles!: AuthenticatedRole[];

    @ApiProperty({ type: [String] })
    permissions!: string[];

    @ApiProperty({ type: SubscriptionCapabilityDto, nullable: true })
    subscription!: SubscriptionCapabilityDto | null;
}
