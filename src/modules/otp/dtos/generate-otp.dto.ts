import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { OtpChannel, OtpType } from '@gen/prisma/enums';

export class GenerateOtpDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    destination!: string;

    @IsEnum(OtpType)
    type!: OtpType;

    @IsEnum(OtpChannel)
    channel!: OtpChannel;
}
