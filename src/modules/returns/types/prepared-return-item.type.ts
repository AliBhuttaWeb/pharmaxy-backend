import { PreparedReturnBatch } from './prepared-return-batch.type';

export interface PreparedReturnItem {
    invoice_item_id: string;
    branch_product_id: string;
    quantity: number;
    refund_amount: number;
    batches: PreparedReturnBatch[];
}
