export function generateInvoiceNumber(lastInvoiceNumber?: string | null) {
    if (!lastInvoiceNumber) {
        return 'INV-000001';
    }

    const lastNumber = Number(lastInvoiceNumber.replace('INV-', ''));

    return `INV-${String(lastNumber + 1).padStart(6, '0')}`;
}
