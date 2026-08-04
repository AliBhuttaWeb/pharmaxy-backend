export const PURCHASE_ORDER_WORKFLOW_PERMISSIONS = {
    // Supplier side

    PURCHASE_ORDER_WORKFLOW_ACCEPT: {
        name: 'purchase_orders.accept',
        description: 'Accept purchase order request',
    },

    PURCHASE_ORDER_WORKFLOW_REJECT: {
        name: 'purchase_orders.reject',
        description: 'Reject purchase order request',
    },

    PURCHASE_ORDER_WORKFLOW_MARK_READY: {
        name: 'purchase_orders.mark_ready',
        description: 'Mark purchase order items as ready for delivery',
    },

    PURCHASE_ORDER_WORKFLOW_DISPATCH: {
        name: 'purchase_orders.dispatch',
        description: 'Dispatch items against purchase order',
    },

    PURCHASE_ORDER_WORKFLOW_DELIVER: {
        name: 'purchase_orders.deliver',
        description: 'Mark purchase order as delivered',
    },

    PURCHASE_ORDER_WORKFLOW_COMPLETE: {
        name: 'purchase_orders.complete',
        description: 'Mark purchase order fulfillment as completed',
    },
};
