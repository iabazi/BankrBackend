// Money utilities for safe decimal arithmetic
export function formatMoney(amount: number): number {
    return Math.round(amount * 100) / 100;
}

export function addMoney(a: number, b: number): number {
    return formatMoney(a + b);
}

export function subtractMoney(a: number, b: number): number {
    return formatMoney(a - b);
}

export function validateAmount(amount: number): boolean {
    if (typeof amount !== 'number' || amount <= 0) return false;
    return Number.isFinite(amount);
}
