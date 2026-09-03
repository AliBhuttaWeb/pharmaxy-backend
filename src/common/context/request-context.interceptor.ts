import {
    BadRequestException,
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { BranchesService } from '@/modules/branches/services/branches.service';
import { AuthenticatedUser } from '@/modules/auth/types';
import { RequestContext, RequestStore } from './request-context';
import { requiresBranchContext } from '../helpers';
import { MESSAGES as BRANCH_MESSAGES } from '@/modules/branches/constants'

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
    constructor(private readonly branchesService: BranchesService) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();

        const user = request.user as AuthenticatedUser | undefined;

        if (user) {
            const branchId = request.cookies?.branch_id ?? request.headers['x-branch-id'];

            if (requiresBranchContext(user.roles) && !branchId) {
                throw new BadRequestException(BRANCH_MESSAGES.ERROR.BRANCH_ID_REQUIRED);
            }

            user.branch_id = branchId;
            
            branchId && await this.branchesService.ensureUserHasAccess(user, branchId);
        }

        const store: RequestStore = {
            user: user ?? null,
            requestId: request.headers['x-request-id'] as string | undefined,
        };

        return new Observable((subscriber) => {
            RequestContext.run(store, () => {
                next.handle().subscribe(subscriber);
            });
        });
    }
}
