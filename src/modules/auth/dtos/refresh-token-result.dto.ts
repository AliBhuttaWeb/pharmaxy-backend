import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenResultDto {
    @ApiProperty()
    accessToken!: string;

    @ApiProperty()
    refreshToken!: string;
}
