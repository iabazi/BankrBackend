// Transfer service
import { Transfer } from '../models/types';
import { store } from '../models/store';
import { generateId } from '../utils/id';
import { accountService } from './accountService';
import { transactionService } from './transactionService';
import { formatMoney, subtractMoney, addMoney } from '../utils/money';

export class TransferService {
    private idempotencyStore: Map<string, Transfer> = new Map();

    /**
     * Create a transfer between accounts
     */
    createTransfer(
        fromAccountId: string,
        toAccountId: string,
        userId: string,
        amount: number,
        note?: string,
        idempotencyKey?: string
    ): Transfer {
        // Check idempotency key if provided
        if (idempotencyKey && this.idempotencyStore.has(idempotencyKey)) {
            return this.idempotencyStore.get(idempotencyKey)!;
        }

        // Validate accounts exist and belong to user
        const fromAccount = accountService.verifyAccountOwnership(fromAccountId, userId);
        const toAccount = accountService.getAccountById(toAccountId);

        // Validate amount
        if (amount <= 0 || !Number.isFinite(amount)) {
            throw {
                code: 'INVALID_INPUT',
                message: 'Invalid transfer amount',
                statusCode: 400,
            };
        }

        // Check sufficient funds
        if (subtractMoney(fromAccount.balance, amount) < 0) {
            throw {
                code: 'INSUFFICIENT_FUNDS',
                message: 'Insufficient funds in account',
                statusCode: 409,
            };
        }

        // Create transfer atomically
        const transfer: Transfer = {
            id: generateId(),
            fromAccountId,
            toAccountId,
            amount: formatMoney(amount),
            note,
            status: 'SUCCESS',
            createdAt: new Date(),
        };

        // Update balances
        const newFromBalance = subtractMoney(fromAccount.balance, amount);
        const newToBalance = addMoney(toAccount.balance, amount);

        accountService.updateBalance(fromAccountId, newFromBalance);
        accountService.updateBalance(toAccountId, newToBalance);

        // Create mirrored transactions
        transactionService.createTransaction(
            fromAccountId,
            'DEBIT',
            amount,
            `Transfer to ${toAccount.name}`,
            toAccount.name
        );

        transactionService.createTransaction(
            toAccountId,
            'CREDIT',
            amount,
            `Transfer from ${fromAccount.name}`,
            fromAccount.name
        );

        // Save transfer
        store.saveTransfer(transfer);

        // Store idempotency key
        if (idempotencyKey) {
            this.idempotencyStore.set(idempotencyKey, transfer);
        }

        return transfer;
    }

    /**
     * Get transfer by ID
     */
    getTransferById(id: string): Transfer {
        const transfer = store.getTransferById(id);
        if (!transfer) {
            throw {
                code: 'NOT_FOUND',
                message: 'Transfer not found',
                statusCode: 404,
            };
        }
        return transfer;
    }
}

export const transferService = new TransferService();
