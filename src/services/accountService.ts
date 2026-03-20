// Account service
import { Account } from '../models/types';
import { db } from '../models/db';

function rowToAccount(row: any): Account {
    return {
        id: row.id,
        userId: row.user_id,
        type: row.type,
        name: row.name,
        numberMasked: row.number_masked,
        currency: row.currency,
        balance: parseFloat(row.balance),
    };
}

export class AccountService {
    async getAccountById(id: string): Promise<Account> {
        const result = await db.query('SELECT * FROM accounts WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            throw { code: 'NOT_FOUND', message: 'Account not found', statusCode: 404 };
        }
        return rowToAccount(result.rows[0]);
    }

    async getAccountsByUserId(userId: string): Promise<Account[]> {
        const result = await db.query('SELECT * FROM accounts WHERE user_id = $1 ORDER BY name', [userId]);
        return result.rows.map(rowToAccount);
    }

    async verifyAccountOwnership(accountId: string, userId: string): Promise<Account> {
        const account = await this.getAccountById(accountId);
        if (account.userId !== userId) {
            throw { code: 'FORBIDDEN', message: 'You do not have access to this account', statusCode: 403 };
        }
        return account;
    }

    async updateBalance(accountId: string, newBalance: number): Promise<Account> {
        const rounded = Math.round(newBalance * 100) / 100;
        const result = await db.query(
            'UPDATE accounts SET balance = $1 WHERE id = $2 RETURNING *',
            [rounded, accountId]
        );
        return rowToAccount(result.rows[0]);
    }
}

export const accountService = new AccountService();
