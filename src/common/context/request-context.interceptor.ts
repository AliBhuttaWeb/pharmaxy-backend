import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthenticatedUser } from '@/modules/auth/types';
import { RequestContext, RequestStore } from './request-context';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();

        const user = (request.user as AuthenticatedUser) || null;

        const store: RequestStore = {
            user,
            pharmacyId: user?.pharmacyId ?? null,
            activeBranchId: user?.activeBranchId ?? null,
            requestId: (request.headers['x-request-id'] as string) || undefined,
        };

        return new Observable((subscriber) => {
            RequestContext.run(store, () => {
                next.handle().subscribe(subscriber);
            });
        });
    }
}
