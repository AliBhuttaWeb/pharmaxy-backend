import { SetMetadata } from '@nestjs/common';

export const BYPASS_BRANCH_CONTEXT_KEY = 'bypassBranchContext';

/**
 * Decorator to exempt a route or controller from requiring an active branch context.
 * Used on routes like branch listing where a branch hasn't been selected yet.
 */
export const BypassBranchContext = () => SetMetadata(BYPASS_BRANCH_CONTEXT_KEY, true);
