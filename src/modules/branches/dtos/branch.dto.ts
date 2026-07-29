import { ApiProperty } from '@nestjs/swagger';

export class BranchDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    pharmacy_id!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    address!: string;

    @ApiProperty()
    city!: string;

    @ApiProperty({
        nullable: true,
    })
    state!: string | null;

    @ApiProperty()
    country!: string;

    @ApiProperty({
        nullable: true,
    })
    postal_code!: string | null;

    @ApiProperty({
        nullable: true,
    })
    latitude!: string | null;

    @ApiProperty({
        nullable: true,
    })
    longitude!: string | null;

    @ApiProperty({
        nullable: true,
    })
    email!: string | null;

    @ApiProperty({
        nullable: true,
    })
    phone!: string | null;

    @ApiProperty()
    is_main!: boolean;

    @ApiProperty()
    is_active!: boolean;

    @ApiProperty()
    created_at!: Date;

    @ApiProperty()
    updated_at!: Date;
}
