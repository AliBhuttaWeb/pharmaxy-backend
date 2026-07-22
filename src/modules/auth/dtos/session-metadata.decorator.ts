import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { SessionMetadata } from '@/modules/auth/types';

export const Session = createParamDecorator(
    (_data: unknown, context: ExecutionContext): SessionMetadata => {
        const request = context.switchToHttp().getRequest();

        return {
            deviceName: request.headers['x-device-name'] ?? null,

            ipAddress: request.ip ?? request.headers['x-forwarded-for'] ?? null,

            userAgent: request.headers['user-agent'] ?? null,
        };
    },
);
