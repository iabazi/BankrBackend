// Seed service - populates database with initial test data
import { db } from '../models/db';
import { schema } from '../models/schema';
import { generateId } from '../utils/id';
import bcrypt from 'bcrypt';

export class SeedService {
    async initSchema(): Promise<void> {
        await db.query(schema);
        console.log('✓ Schema ready');
    }

    async seed(): Promise<void> {
        // Check if already seeded
        const existing = await db.query("SELECT id FROM users WHERE email = 'alex@example.com'");
        if (existing.rows.length > 0) {
            console.log('✓ Database already seeded, skipping');
            return;
        }

        const passwordHash = await bcrypt.hash('password', 10);

        // ===== USER 1: Alex Demo =====
        const alexId = generateId();
        await db.query(
            'INSERT INTO users (id, name, email, password_hash, created_at) VALUES ($1, $2, $3, $4, $5)',
            [alexId, 'Alex Demo', 'alex@example.com', passwordHash, new Date('2024-01-01')]
        );

        const alexCheckingId = generateId();
        await db.query(
            'INSERT INTO accounts (id, user_id, type, name, number_masked, currency, balance) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [alexCheckingId, alexId, 'CHECKING', 'Chequing Account', '**** **** **** 1234', 'CAD', 2360.42]
        );

        const alexSavingsId = generateId();
        await db.query(
            'INSERT INTO accounts (id, user_id, type, name, number_masked, currency, balance) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [alexSavingsId, alexId, 'SAVINGS', 'Savings Account', '**** **** **** 5678', 'CAD', 12450.00]
        );

        // Alex's checking transactions
        const alexCheckingTxs = [
            { type: 'CREDIT', amount: 2500.00, description: 'Direct deposit - Payroll', counterparty: 'MyCompany Inc', date: '2024-02-20' },
            { type: 'DEBIT', amount: 89.99, description: 'Grocery store', counterparty: 'Whole Foods Market', date: '2024-02-19' },
            { type: 'DEBIT', amount: 49.99, description: 'Gas station', counterparty: 'Shell Gas Station', date: '2024-02-18' },
            { type: 'CREDIT', amount: 500.00, description: 'Transfer from Savings', counterparty: 'Savings Account', date: '2024-02-17' },
            { type: 'DEBIT', amount: 1200.00, description: 'Rent payment', counterparty: 'Property Management Inc', date: '2024-02-15' },
            { type: 'DEBIT', amount: 35.50, description: 'Coffee shop', counterparty: 'Starbucks', date: '2024-02-14' },
            { type: 'DEBIT', amount: 15.00, description: 'Movie ticket', counterparty: 'AMC Theaters', date: '2024-02-13' },
            { type: 'CREDIT', amount: 200.00, description: 'Freelance project', counterparty: 'Client ABC', date: '2024-02-12' },
            { type: 'DEBIT', amount: 55.00, description: 'Internet bill', counterparty: 'ISP Provider', date: '2024-02-11' },
            { type: 'DEBIT', amount: 120.00, description: 'Phone bill', counterparty: 'Mobile Carrier', date: '2024-02-10' },
        ];

        for (const tx of alexCheckingTxs) {
            await db.query(
                'INSERT INTO transactions (id, account_id, type, amount, description, counterparty, timestamp, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                [generateId(), alexCheckingId, tx.type, tx.amount, tx.description, tx.counterparty, new Date(tx.date), 'POSTED']
            );
        }

        // Alex's savings transactions
        const alexSavingsTxs = [
            { type: 'CREDIT', amount: 1000.00, description: 'Monthly savings transfer', counterparty: 'Chequing Account', date: '2024-02-18' },
            { type: 'DEBIT', amount: 500.00, description: 'Transfer to Chequing', counterparty: 'Chequing Account', date: '2024-02-17' },
            { type: 'CREDIT', amount: 50.25, description: 'Interest accrued', counterparty: 'Bank', date: '2024-02-15' },
            { type: 'CREDIT', amount: 2000.00, description: 'Tax refund', counterparty: 'CRA', date: '2024-02-10' },
            { type: 'CREDIT', amount: 1000.00, description: 'Monthly savings transfer', counterparty: 'Chequing Account', date: '2024-02-01' },
        ];

        for (const tx of alexSavingsTxs) {
            await db.query(
                'INSERT INTO transactions (id, account_id, type, amount, description, counterparty, timestamp, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                [generateId(), alexSavingsId, tx.type, tx.amount, tx.description, tx.counterparty, new Date(tx.date), 'POSTED']
            );
        }

        // ===== USER 2: QA Tester =====
        const qaId = generateId();
        await db.query(
            'INSERT INTO users (id, name, email, password_hash, created_at) VALUES ($1, $2, $3, $4, $5)',
            [qaId, 'QA Tester', 'qa@example.com', passwordHash, new Date('2024-01-10')]
        );

        const qaCheckingId = generateId();
        await db.query(
            'INSERT INTO accounts (id, user_id, type, name, number_masked, currency, balance) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [qaCheckingId, qaId, 'CHECKING', 'QA Checking', '**** **** **** 9999', 'CAD', 5000.00]
        );

        const qaSavingsId = generateId();
        await db.query(
            'INSERT INTO accounts (id, user_id, type, name, number_masked, currency, balance) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [qaSavingsId, qaId, 'SAVINGS', 'QA Savings', '**** **** **** 8888', 'CAD', 10000.00]
        );

        // ===== USER 3: Jane Smith =====
        const janeId = generateId();
        await db.query(
            'INSERT INTO users (id, name, email, password_hash, created_at) VALUES ($1, $2, $3, $4, $5)',
            [janeId, 'Jane Smith', 'jane@example.com', passwordHash, new Date('2024-01-15')]
        );

        const janeCheckingId = generateId();
        await db.query(
            'INSERT INTO accounts (id, user_id, type, name, number_masked, currency, balance) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [janeCheckingId, janeId, 'CHECKING', 'Chequing', '**** **** **** 7777', 'CAD', 3500.00]
        );

        const janeSavingsId = generateId();
        await db.query(
            'INSERT INTO accounts (id, user_id, type, name, number_masked, currency, balance) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [janeSavingsId, janeId, 'SAVINGS', 'Savings', '**** **** **** 6666', 'CAD', 25000.00]
        );

        console.log('✓ Database seeded successfully');
        console.log('Test credentials: alex@example.com / qa@example.com / jane@example.com — all password: "password"');
    }
}

export const seedService = new SeedService();
