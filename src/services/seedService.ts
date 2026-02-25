// Seed service to populate initial data
import { User, Account, Transaction } from '../models/types';
import { store } from '../models/store';
import { generateId } from '../utils/id';
import bcrypt from 'bcrypt';

export class SeedService {
    async seed(): Promise<void> {
        // Clear existing data
        store.clear();

        // ===== USER 1: Alex Demo (Primary test user) =====
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

        // ===== USER 2: QA Tester (For QA testing) =====
        const qaUserId = generateId();
        const qaUser: User = {
            id: qaUserId,
            name: 'QA Tester',
            email: 'qa@example.com',
            passwordHash,
            createdAt: new Date('2024-01-10'),
        };

        store.saveUser(qaUser);

        // ===== USER 3: Jane Smith (For transfer testing) =====
        const janeUserId = generateId();
        const janeUser: User = {
            id: janeUserId,
            name: 'Jane Smith',
            email: 'jane@example.com',
            passwordHash,
            createdAt: new Date('2024-01-15'),
        };

        store.saveUser(janeUser);

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

        // ===== QA TESTER ACCOUNTS =====
        const qaCheckingId = generateId();
        const qaChecking: Account = {
            id: qaCheckingId,
            userId: qaUserId,
            type: 'CHECKING',
            name: 'QA Checking',
            numberMasked: '**** **** **** 9999',
            currency: 'CAD',
            balance: 5000.0,
        };
        store.saveAccount(qaChecking);

        const qaSavingsId = generateId();
        const qaSavings: Account = {
            id: qaSavingsId,
            userId: qaUserId,
            type: 'SAVINGS',
            name: 'QA Savings',
            numberMasked: '**** **** **** 8888',
            currency: 'CAD',
            balance: 10000.0,
        };
        store.saveAccount(qaSavings);

        // ===== JANE SMITH ACCOUNTS (For transfer testing) =====
        const janeCheckingId = generateId();
        const janeChecking: Account = {
            id: janeCheckingId,
            userId: janeUserId,
            type: 'CHECKING',
            name: 'Chequing',
            numberMasked: '**** **** **** 7777',
            currency: 'CAD',
            balance: 3500.0,
        };
        store.saveAccount(janeChecking);

        const janeSavingsId = generateId();
        const janeSavings: Account = {
            id: janeSavingsId,
            userId: janeUserId,
            type: 'SAVINGS',
            name: 'Savings',
            numberMasked: '**** **** **** 6666',
            currency: 'CAD',
            balance: 25000.0,
        };
        store.saveAccount(janeSavings);

        // ===== ADDITIONAL TRANSACTIONS FOR QA ACCOUNTS =====
        const qaTransactions: Transaction[] = [
            {
                id: generateId(),
                accountId: qaCheckingId,
                type: 'CREDIT',
                amount: 5000.0,
                description: 'Initial deposit',
                counterparty: 'Test Bank',
                timestamp: new Date('2024-02-20'),
                status: 'POSTED',
            },
            {
                id: generateId(),
                accountId: qaCheckingId,
                type: 'DEBIT',
                amount: 150.0,
                description: 'Test transaction',
                counterparty: 'Test Merchant',
                timestamp: new Date('2024-02-19'),
                status: 'POSTED',
            },
            {
                id: generateId(),
                accountId: qaSavingsId,
                type: 'CREDIT',
                amount: 1000.0,
                description: 'Monthly savings',
                counterparty: 'QA Checking',
                timestamp: new Date('2024-02-18'),
                status: 'POSTED',
            },
        ];
        qaTransactions.forEach((t) => store.saveTransaction(t));

        // ===== TRANSACTIONS FOR JANE SMITH =====
        const janeTransactions: Transaction[] = [
            {
                id: generateId(),
                accountId: janeCheckingId,
                type: 'CREDIT',
                amount: 3500.0,
                description: 'Salary deposit',
                counterparty: 'Tech Corp',
                timestamp: new Date('2024-02-20'),
                status: 'POSTED',
            },
            {
                id: generateId(),
                accountId: janeCheckingId,
                type: 'DEBIT',
                amount: 200.0,
                description: 'Restaurant',
                counterparty: 'Olive Garden',
                timestamp: new Date('2024-02-19'),
                status: 'POSTED',
            },
            {
                id: generateId(),
                accountId: janeSavingsId,
                type: 'CREDIT',
                amount: 2000.0,
                description: 'Investment return',
                counterparty: 'Broker',
                timestamp: new Date('2024-02-18'),
                status: 'POSTED',
            },
        ];
        janeTransactions.forEach((t) => store.saveTransaction(t));

        console.log('✓ Database seeded successfully');
        console.log('\n=== TEST CREDENTIALS ===');
        console.log('User 1: alex@example.com / password');
        console.log('User 2: qa@example.com / password');
        console.log('User 3: jane@example.com / password');
        console.log('================================\n');
    }
}

export const seedService = new SeedService();
