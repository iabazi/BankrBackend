// Transaction service
import { Transaction } from '../models/types';
import { store } from '../models/store';
import { generateId } from '../utils/id';

export class TransactionService {
    /**
     * Get transaction by ID
     */
    getTransactionById(id: string): Transaction {
        const transaction = store.getTransactionById(id);
        if (!transaction) {
            throw {
                code: 'NOT_FOUND',
                message: 'Transaction not found',
                statusCode: 404,
            };
        }
        return transaction;
    }

    /**
     * Get transactions for an account, paginated and sorted by timestamp descending
     */
    getTransactionsByAccountId(accountId: string): Transaction[] {
        return store.getTransactionsByAccountId(accountId);
    }

    /**
     * Create a transaction
     */
    createTransaction(
        accountId: string,
        type: 'DEBIT' | 'CREDIT',
        amount: number,
        description: string,
        counterparty: string,
        status: 'POSTED' | 'PENDING' = 'POSTED'
    ): Transaction {
        const transaction: Transaction = {
            id: generateId(),
            accountId,
            type,
            amount,
            description,
            counterparty,
            timestamp: new Date(),
            status,
        };

        store.saveTransaction(transaction);
        return transaction;
    }
}

export const transactionService = new TransactionService();
