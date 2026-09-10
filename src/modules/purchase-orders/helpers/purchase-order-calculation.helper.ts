import { CreatePurchaseOrderDto } from '../dtos';

export function calculatePurchaseOrderTotals(dto: CreatePurchaseOrderDto) {
    let subtotal = 0;

    let totalDiscount = 0;

    let totalTax = 0;

    const items = dto.items.map((item) => {
        const quantity = item.ordered_quantity;

        const unitCost = item.unit_cost;

        const lineSubtotal = quantity * unitCost;

        const discountAmount = item.discount_amount
            ? item.discount_amount
            : item.discount_percentage
              ? (lineSubtotal * item.discount_percentage) / 100
              : 0;

        const amountAfterDiscount = lineSubtotal - discountAmount;

        const taxAmount = item.tax_amount
            ? item.tax_amount
            : item.tax_percentage
              ? (amountAfterDiscount * item.tax_percentage) / 100
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

            fulfilled_quantity: 0,

            received_quantity: 0,

            unit_cost: item.unit_cost,

            discount_percentage: item.discount_percentage,

            discount_amount: discountAmount,

            tax_percentage: item.tax_percentage,

            tax_amount: taxAmount,

            line_total: lineTotal,

            remarks: item.remarks,
        };
    });

    const orderDiscount = dto.discount_amount ?? 0;

    const orderTax = dto.tax_amount ?? 0;

    const shippingAmount = dto.shipping_amount ?? 0;

    const otherCharges = dto.other_charges ?? 0;

    const grandTotal = subtotal - orderDiscount + orderTax + shippingAmount + otherCharges;

    return {
        subtotal,

        discountAmount: totalDiscount + orderDiscount,

        taxAmount: totalTax + orderTax,

        grandTotal,

        items,
    };
}
