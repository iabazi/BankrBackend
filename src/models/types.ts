// Data types for the banking API
export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
}

export interface Account {
    id: string;
    userId: string;
    type: 'CHECKING' | 'SAVINGS';
    name: string;
    numberMasked: string;
    currency: string;
    balance: number;
}

export interface Transaction {
    id: string;
    accountId: string;
    type: 'DEBIT' | 'CREDIT';
    amount: number;
    description: string;
    counterparty: string;
    timestamp: Date;
    status: 'POSTED' | 'PENDING';
}

export interface Transfer {
    id: string;
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    note?: string;
    status: 'SUCCESS' | 'FAILED';
    createdAt: Date;
}

export interface JWTPayload {
    userId: string;
    email: string;
}

export interface ErrorResponse {
    error: {
        code: string;
        message: string;
    };
}

export interface PaginatedResponse<T> {
    data: T[];
    cursor?: string;
    hasMore: boolean;
}
