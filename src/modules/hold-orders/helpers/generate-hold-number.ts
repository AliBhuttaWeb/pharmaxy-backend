export function generateHoldNumber(latestHoldNumber?: string | null) {
    if (!latestHoldNumber) {
        return 'HLD-000001';
    }

    const lastNumber = Number(latestHoldNumber.replace('HLD-', ''));

    return `HLD-${String(lastNumber + 1).padStart(6, '0')}`;
}
