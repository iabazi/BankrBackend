// Transaction service
import { Transaction } from '../models/types';
import { db } from '../models/db';
import { generateId } from '../utils/id';

function rowToTransaction(row: any): Transaction {
    return {
        id: row.id,
        accountId: row.account_id,
        type: row.type,
        amount: parseFloat(row.amount),
        description: row.description,
        counterparty: row.counterparty,
        timestamp: row.timestamp,
        status: row.status,
    };
}

export class TransactionService {
    async getTransactionById(id: string): Promise<Transaction> {
        const result = await db.query('SELECT * FROM transactions WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            throw { code: 'NOT_FOUND', message: 'Transaction not found', statusCode: 404 };
        }
        return rowToTransaction(result.rows[0]);
    }

    async getTransactionsByAccountId(
        accountId: string,
        limit: number = 20,
        cursor?: string
    ): Promise<{ data: Transaction[]; cursor?: string; hasMore: boolean }> {
        let query: string;
        let params: any[];

        if (cursor) {
            // Get the timestamp of the cursor transaction for keyset pagination
            const cursorResult = await db.query(
                'SELECT timestamp FROM transactions WHERE id = $1',
                [cursor]
            );
            if (cursorResult.rows.length === 0) {
                throw { code: 'NOT_FOUND', message: 'Cursor not found', statusCode: 404 };
            }
            const cursorTimestamp = cursorResult.rows[0].timestamp;
            query = `
                SELECT * FROM transactions 
                WHERE account_id = $1 AND timestamp < $2
                ORDER BY timestamp DESC 
                LIMIT $3
            `;
            params = [accountId, cursorTimestamp, limit + 1];
        } else {
            query = `
                SELECT * FROM transactions 
                WHERE account_id = $1 
                ORDER BY timestamp DESC 
                LIMIT $2
            `;
            params = [accountId, limit + 1];
        }

        const result = await db.query(query, params);
        const rows = result.rows;
        const hasMore = rows.length > limit;
        const data = rows.slice(0, limit).map(rowToTransaction);
        const nextCursor = hasMore ? data[data.length - 1].id : undefined;

        return { data, cursor: nextCursor, hasMore };
    }

    async createTransaction(
        accountId: string,
        type: 'DEBIT' | 'CREDIT',
        amount: number,
        description: string,
        counterparty: string,
        status: 'POSTED' | 'PENDING' = 'POSTED'
    ): Promise<Transaction> {
        const id = generateId();
        const timestamp = new Date();

        await db.query(
            'INSERT INTO transactions (id, account_id, type, amount, description, counterparty, timestamp, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [id, accountId, type, amount, description, counterparty, timestamp, status]
        );

        return { id, accountId, type, amount, description, counterparty, timestamp, status };
    }
}

export const transactionService = new TransactionService();
