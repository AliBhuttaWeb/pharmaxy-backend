import { ApiProperty } from '@nestjs/swagger';
import { PharmacyStatus } from '@prisma/client';
import { AuthenticatedRole } from '../types';

export class PharmacyContextDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty({ nullable: true })
    logo_url!: string | null;

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
    is_main!: boolean;
}

export class AuthContextDto {
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
}
