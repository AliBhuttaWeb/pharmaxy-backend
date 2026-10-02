import { ConflictException } from '@nestjs/common';

import { MESSAGES } from '../constants/messages.constants';

export function allocateStock(
    batches: {
        id: string;
        quantity: number;
    }[],
    requestedQuantity: number,
) {
    if (requestedQuantity <= 0) {
        throw new ConflictException(MESSAGES.ERROR.QUANTITY_MUST_BE_AT_LEAST_ONE);
    }

    let remaining = requestedQuantity;

    const allocations: {
        product_batch_id: string;
        quantity: number;
    }[] = [];

    for (const batch of batches) {
        if (remaining <= 0) {
            break;
        }

        const allocated = Math.min(batch.quantity, remaining);

        allocations.push({
            product_batch_id: batch.id,
            quantity: allocated,
        });

        remaining -= allocated;
    }

    if (remaining > 0) {
        throw new ConflictException(MESSAGES.ERROR.INSUFFICIENT_BATCH_STOCK);
    }

    return allocations;
}
