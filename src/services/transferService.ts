// Transfer service
import { Transfer } from '../models/types';
import { db } from '../models/db';
import { generateId } from '../utils/id';
import { accountService } from './accountService';
import { formatMoney, subtractMoney, addMoney } from '../utils/money';

function rowToTransfer(row: any): Transfer {
    return {
        id: row.id,
        fromAccountId: row.from_account_id,
        toAccountId: row.to_account_id,
        amount: parseFloat(row.amount),
        note: row.note,
        status: row.status,
        createdAt: row.created_at,
    };
}

export class TransferService {
    async createTransfer(
        fromAccountId: string,
        toAccountId: string,
        userId: string,
        amount: number,
        note?: string,
        idempotencyKey?: string
    ): Promise<Transfer> {
        // Check idempotency key
        if (idempotencyKey) {
            const existing = await db.query(
                'SELECT t.* FROM transfers t JOIN idempotency_keys ik ON t.id = ik.transfer_id WHERE ik.key = $1',
                [idempotencyKey]
            );
            if (existing.rows.length > 0) {
                return rowToTransfer(existing.rows[0]);
            }
        }

        // Validate accounts
        const fromAccount = await accountService.verifyAccountOwnership(fromAccountId, userId);
        const toAccount = await accountService.getAccountById(toAccountId);

        if (amount <= 0 || !Number.isFinite(amount)) {
            throw { code: 'INVALID_INPUT', message: 'Invalid transfer amount', statusCode: 400 };
        }

        if (subtractMoney(fromAccount.balance, amount) < 0) {
            throw { code: 'INSUFFICIENT_FUNDS', message: 'Insufficient funds in account', statusCode: 409 };
        }

        // Run everything in a transaction so it's atomic
        const client = await (await import('../models/db')).default.connect();
        try {
            await client.query('BEGIN');

            const transferId = generateId();
            const createdAt = new Date();
            const formattedAmount = formatMoney(amount);

            // Insert transfer
            await client.query(
                'INSERT INTO transfers (id, from_account_id, to_account_id, amount, note, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [transferId, fromAccountId, toAccountId, formattedAmount, note || null, 'SUCCESS', createdAt]
            );

            // Update balances
            const newFromBalance = subtractMoney(fromAccount.balance, amount);
            const newToBalance = addMoney(toAccount.balance, amount);

            await client.query('UPDATE accounts SET balance = $1 WHERE id = $2', [newFromBalance, fromAccountId]);
            await client.query('UPDATE accounts SET balance = $1 WHERE id = $2', [newToBalance, toAccountId]);

            // Create mirrored transactions
            const txId1 = generateId();
            const txId2 = generateId();
            const now = new Date();

            await client.query(
                'INSERT INTO transactions (id, account_id, type, amount, description, counterparty, timestamp, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                [txId1, fromAccountId, 'DEBIT', formattedAmount, `Transfer to ${toAccount.name}`, toAccount.name, now, 'POSTED']
            );

            await client.query(
                'INSERT INTO transactions (id, account_id, type, amount, description, counterparty, timestamp, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                [txId2, toAccountId, 'CREDIT', formattedAmount, `Transfer from ${fromAccount.name}`, fromAccount.name, now, 'POSTED']
            );

            // Store idempotency key
            if (idempotencyKey) {
                await client.query(
                    'INSERT INTO idempotency_keys (key, transfer_id) VALUES ($1, $2)',
                    [idempotencyKey, transferId]
                );
            }

            await client.query('COMMIT');

            return { id: transferId, fromAccountId, toAccountId, amount: formattedAmount, note, status: 'SUCCESS', createdAt };
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    async getTransferById(id: string): Promise<Transfer> {
        const result = await db.query('SELECT * FROM transfers WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            throw { code: 'NOT_FOUND', message: 'Transfer not found', statusCode: 404 };
        }
        return rowToTransfer(result.rows[0]);
    }
}

export const transferService = new TransferService();
