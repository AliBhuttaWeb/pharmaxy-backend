import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { Observable, map } from 'rxjs';

import { MESSAGES } from '@/common/constants';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const request = context.switchToHttp().getRequest();

        return next.handle().pipe(
            map((response) => ({
                success: true,
                message: response?.message ?? MESSAGES.SUCCESS.COMPLETED,
                data: response,
                timestamp: new Date().toISOString(),
                path: request.originalUrl,
            })),
        );
    }
}
