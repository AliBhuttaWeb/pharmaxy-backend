import { ConflictException } from '@nestjs/common';

export function allocateStock(
    batches: {
        id: string;
        quantity: number;
    }[],
    requestedQuantity: number,
) {
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
        throw new ConflictException('Insufficient batch stock');
    }

    return allocations;
}
