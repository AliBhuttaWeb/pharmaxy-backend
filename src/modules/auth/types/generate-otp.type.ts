import { OtpChannel, OtpType } from '@gen/prisma/enums';

export type GenerateOtpInput = {
    userId?: string;

    destination: string;

    type: OtpType;

    channel: OtpChannel;
};
