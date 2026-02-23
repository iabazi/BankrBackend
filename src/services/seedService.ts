// Seed service to populate initial data
import { User, Account, Transaction } from '../models/types';
import { store } from '../models/store';
import { generateId } from '../utils/id';
import bcrypt from 'bcrypt';

export class SeedService {
    async seed(): Promise<void> {
        // Clear existing data
        store.clear();

        // Create seed user
        const passwordHash = await bcrypt.hash('password', 10);
        const userId = generateId();

        const user: User = {
            id: userId,
            name: 'Alex Demo',
            email: 'alex@example.com',
            passwordHash,
            createdAt: new Date('2024-01-01'),
        };

        store.saveUser(user);

        // Create checking account
        const checkingId = generateId();
        const checking: Account = {
            id: checkingId,
            userId,
            type: 'CHECKING',
            name: 'Chequing Account',
            numberMasked: '**** **** **** 1234',
            currency: 'CAD',
            balance: 2360.42,
        };

        store.saveAccount(checking);

        // Create savings account
        const savingsId = generateId();
        const savings: Account = {
            id: savingsId,
            userId,
            type: 'SAVINGS',
            name: 'Savings Account',
            numberMasked: '**** **** **** 5678',
            currency: 'CAD',
            balance: 12450.0,
        };

        store.saveAccount(savings);

        // Create transactions for checking account
        const checkingTransactions: Transaction[] = [
            {
                id: generateId(),
                accountId: checkingId,
                type: 'CREDIT',
                amount: 2500.0,
                description: 'Direct deposit - Payroll',
                counterparty: 'MyCompany Inc',
                timestamp: new Date('2024-02-20'),
                status: 'POSTED',
            },
            {
                id: generateId(),
                accountId: checkingId,
                type: 'DEBIT',
                amount: 89.99,
                description: 'Grocery store',
                counterparty: 'Whole Foods Market',
                timestamp: new Date('2024-02-19'),
                status: 'POSTED',
            },
            {
                id: generateId(),
                accountId: checkingId,
                type: 'DEBIT',
                amount: 49.99,
                description: 'Gas station',
                counterparty: 'Shell Gas Station',
                timestamp: new Date('2024-02-18'),
                status: 'POSTED',
            },
            {
                id: generateId(),
                accountId: checkingId,
                type: 'CREDIT',
                amount: 500.0,
                description: 'Transfer from Savings',
                counterparty: 'Savings Account',
                timestamp: new Date('2024-02-17'),
                status: 'POSTED',
            },
            {
                id: generateId(),
                accountId: checkingId,
                type: 'DEBIT',
                amount: 1200.0,
                description: 'Rent payment',
                counterparty: 'Property Management Inc',
                timestamp: new Date('2024-02-15'),
                status: 'POSTED',
            },
            {
                id: generateId(),
                accountId: checkingId,
                type: 'DEBIT',
                amount: 35.5,
                description: 'Coffee shop',
                counterparty: 'Starbucks',
                timestamp: new Date('2024-02-14'),
                status: 'POSTED',
            },
            {
                id: generateId(),
                accountId: checkingId,
                type: 'DEBIT',
                amount: 15.0,
                description: 'Movie ticket',
                counterparty: 'AMC Theaters',
                timestamp: new Date('2024-02-13'),
                status: 'POSTED',
            },
            {
                id: generateId(),
                accountId: checkingId,
                type: 'CREDIT',
                amount: 200.0,
                description: 'Freelance project',
                counterparty: 'Client ABC',
                timestamp: new Date('2024-02-12'),
                status: 'POSTED',
            },
            {
                id: generateId(),
                accountId: checkingId,
                type: 'DEBIT',
                amount: 55.0,
                description: 'Internet bill',
                counterparty: 'ISP Provider',
                timestamp: new Date('2024-02-11'),
                status: 'POSTED',
            },
            {
                id: generateId(),
                accountId: checkingId,
                type: 'DEBIT',
                amount: 120.0,
                description: 'Phone bill',
                counterparty: 'Mobile Carrier',
                timestamp: new Date('2024-02-10'),
                status: 'POSTED',
            },
        ];

        checkingTransactions.forEach((t) => store.saveTransaction(t));

        // Create transactions for savings account
        const savingsTransactions: Transaction[] = [
            {
                id: generateId(),
                accountId: savingsId,
                type: 'CREDIT',
                amount: 1000.0,
                description: 'Monthly savings transfer',
                counterparty: 'Chequing Account',
                timestamp: new Date('2024-02-18'),
                status: 'POSTED',
            },
            {
                id: generateId(),
                accountId: savingsId,
                type: 'DEBIT',
                amount: 500.0,
                description: 'Transfer to Chequing',
                counterparty: 'Chequing Account',
                timestamp: new Date('2024-02-17'),
                status: 'POSTED',
            },
            {
                id: generateId(),
                accountId: savingsId,
                type: 'CREDIT',
                amount: 50.25,
                description: 'Interest accrued',
                counterparty: 'Bank',
                timestamp: new Date('2024-02-15'),
                status: 'POSTED',
            },
            {
                id: generateId(),
                accountId: savingsId,
                type: 'CREDIT',
                amount: 2000.0,
                description: 'Tax refund',
                counterparty: 'CRA',
                timestamp: new Date('2024-02-10'),
                status: 'POSTED',
            },
            {
                id: generateId(),
                accountId: savingsId,
                type: 'CREDIT',
                amount: 1000.0,
                description: 'Monthly savings transfer',
                counterparty: 'Chequing Account',
                timestamp: new Date('2024-02-01'),
                status: 'POSTED',
            },
            {
                id: generateId(),
                accountId: savingsId,
                type: 'CREDIT',
                amount: 1000.0,
                description: 'Monthly savings transfer',
                counterparty: 'Chequing Account',
                timestamp: new Date('2024-01-18'),
                status: 'POSTED',
            },
            {
                id: generateId(),
                accountId: savingsId,
                type: 'CREDIT',
                amount: 1000.0,
                description: 'Monthly savings transfer',
                counterparty: 'Chequing Account',
                timestamp: new Date('2024-01-01'),
                status: 'POSTED',
            },
        ];

        savingsTransactions.forEach((t) => store.saveTransaction(t));

        console.log('✓ Database seeded successfully');
    }
}

export const seedService = new SeedService();
