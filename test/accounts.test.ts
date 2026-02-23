import request from 'supertest';
import app from '../src/app';
import { store } from '../src/models/store';
import { seedService } from '../src/services/seedService';
import { authService } from '../src/services/authService';

describe('Account Routes', () => {
    let token: string;
    let userId: string;

    beforeAll(async () => {
        await seedService.seed();
        const user = store.getUserByEmail('alex@example.com')!;
        userId = user.id;
        token = authService.generateToken(user);
    });

    describe('GET /accounts', () => {
        it('should get all accounts for authenticated user', async () => {
            const response = await request(app)
                .get('/accounts')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.accounts).toBeDefined();
            expect(Array.isArray(response.body.accounts)).toBe(true);
            expect(response.body.accounts.length).toBeGreaterThan(0);
        });

        it('should reject request without token', async () => {
            const response = await request(app).get('/accounts');

            expect(response.status).toBe(401);
            expect(response.body.error.code).toBe('UNAUTHENTICATED');
        });

        it('should reject request with invalid token', async () => {
            const response = await request(app)
                .get('/accounts')
                .set('Authorization', 'Bearer invalid-token');

            expect(response.status).toBe(401);
            expect(response.body.error.code).toBe('UNAUTHENTICATED');
        });
    });

    describe('GET /accounts/:id', () => {
        let accountId: string;

        beforeAll(() => {
            const accounts = store.getAccountsByUserId(userId);
            accountId = accounts[0].id;
        });

        it('should get account details', async () => {
            const response = await request(app)
                .get(`/accounts/${accountId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(accountId);
            expect(response.body.userId).toBe(userId);
            expect(response.body.balance).toBeDefined();
        });

        it('should return 404 for non-existent account', async () => {
            const response = await request(app)
                .get('/accounts/nonexistent-id')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.error.code).toBe('NOT_FOUND');
        });

        it('should return 401 without token', async () => {
            const response = await request(app).get(`/accounts/${accountId}`);

            expect(response.status).toBe(401);
            expect(response.body.error.code).toBe('UNAUTHENTICATED');
        });
    });
});
