export const MESSAGES = {
    SUCCESS: {
        CREATED: 'Purchase order created successfully',
        UPDATED: 'Purchase order updated successfully',
        DELETED: 'Purchase order deleted successfully',
        APPROVED: 'Purchase order approved successfully',
        RECEIVED: 'Purchase order received successfully',
        CANCELLED: 'Purchase order cancelled successfully',
    },
    ERROR: {
        NOT_FOUND: 'Purchase order not found',
        ALREADY_EXISTS: 'Purchase order already exists',
        DUPLICATE_PRODUCTS: 'Duplicate products are not allowed in a purchase order',
        ALREADY_APPROVED: 'Purchase order is already approved',
        ALREADY_CANCELLED: 'Purchase order is already cancelled',
        ALREADY_RECEIVED: 'Purchase order is already received',
        INVALID_STATUS_FOR_APPROVAL: 'Purchase order cannot be approved in its current status',
        INVALID_STATUS_FOR_CANCELLATION: 'Purchase order cannot be cancelled in its current status',
        INVALID_STATUS_FOR_RECEIVING: 'Purchase order cannot be received in current status',
        RECEIVED_QUANTITY_EXCEEDED: 'Received quantity exceeds ordered quantity',
        BRANCH_PRODUCT_NOT_FOUND: 'Branch product not found',
        BATCH_ALREADY_EXISTS: 'Batch already exists',
    },
};
