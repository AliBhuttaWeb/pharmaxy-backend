import { OtpChannel, OtpType } from '@prisma/enums';

export type GenerateOtpInput = {
    userId?: string;

    destination: string;

    type: OtpType;

    channel: OtpChannel;
};
