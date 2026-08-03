import { CreatePurchaseOrderDto } from '../dtos';

export function calculatePurchaseOrderTotals(dto: CreatePurchaseOrderDto) {
    let subtotal = 0;

    let totalDiscount = 0;

    let totalTax = 0;

    const items = dto.items.map((item) => {
        const quantity = Number(item.ordered_quantity);

        const unitCost = Number(item.unit_cost);

        const lineSubtotal = quantity * unitCost;

        const discountAmount = item.discount_amount
            ? Number(item.discount_amount)
            : item.discount_percentage
              ? (lineSubtotal * Number(item.discount_percentage)) / 100
              : 0;

        const amountAfterDiscount = lineSubtotal - discountAmount;

        const taxAmount = item.tax_amount
            ? Number(item.tax_amount)
            : item.tax_percentage
              ? (amountAfterDiscount * Number(item.tax_percentage)) / 100
              : 0;

        const lineTotal = amountAfterDiscount + taxAmount;

        subtotal += lineSubtotal;

        totalDiscount += discountAmount;

        totalTax += taxAmount;

        return {
            product: {
                connect: {
                    id: item.product_id,
                },
            },

            ordered_quantity: item.ordered_quantity,

            fulfilled_quantity: '0',

            received_quantity: '0',

            unit_cost: item.unit_cost,

            discount_percentage: item.discount_percentage,

            discount_amount: discountAmount.toFixed(2),

            tax_percentage: item.tax_percentage,

            tax_amount: taxAmount.toFixed(2),

            line_total: lineTotal.toFixed(2),

            remarks: item.remarks,
        };
    });

    const orderDiscount = Number(dto.discount_amount ?? 0);

    const orderTax = Number(dto.tax_amount ?? 0);

    const shippingAmount = Number(dto.shipping_amount ?? 0);

    const otherCharges = Number(dto.other_charges ?? 0);

    const grandTotal = subtotal - orderDiscount + orderTax + shippingAmount + otherCharges;

    return {
        subtotal: subtotal.toFixed(2),

        discountAmount: (totalDiscount + orderDiscount).toFixed(2),

        taxAmount: (totalTax + orderTax).toFixed(2),

        grandTotal: grandTotal.toFixed(2),

        items,
    };
}
