import { IsEnum, IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';
import { OtpType } from '@gen/prisma/enums';

export class VerifyOtpDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    destination!: string;

    @IsEnum(OtpType)
    type!: OtpType;

    @IsString()
    @Length(6, 6, { message: 'OTP code must be exactly 6 digits.' })
    code!: string;
}
