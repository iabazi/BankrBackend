import request from 'supertest';
import app from '../src/app';
import { store } from '../src/models/store';
import { seedService } from '../src/services/seedService';
import { authService } from '../src/services/authService';

describe('Transaction Routes', () => {
    let token: string;
    let userId: string;
    let accountId: string;

    beforeAll(async () => {
        await seedService.seed();
        const user = store.getUserByEmail('alex@example.com')!;
        userId = user.id;
        token = authService.generateToken(user);
        const accounts = store.getAccountsByUserId(userId);
        accountId = accounts[0].id;
    });

    describe('GET /accounts/:id/transactions', () => {
        it('should get transactions paginated', async () => {
            const response = await request(app)
                .get(`/accounts/${accountId}/transactions`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toBeDefined();
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.hasMore).toBeDefined();
        });

        it('should respect limit parameter', async () => {
            const response = await request(app)
                .get(`/accounts/${accountId}/transactions?limit=5`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBeLessThanOrEqual(5);
        });

        it('should support cursor pagination', async () => {
            const firstResponse = await request(app)
                .get(`/accounts/${accountId}/transactions?limit=3`)
                .set('Authorization', `Bearer ${token}`);

            expect(firstResponse.status).toBe(200);
            expect(firstResponse.body.hasMore).toBe(true);
            expect(firstResponse.body.cursor).toBeDefined();

            const secondResponse = await request(app)
                .get(
                    `/accounts/${accountId}/transactions?limit=3&cursor=${firstResponse.body.cursor}`
                )
                .set('Authorization', `Bearer ${token}`);

            expect(secondResponse.status).toBe(200);
            expect(secondResponse.body.data.length).toBeGreaterThan(0);
        });

        it('should return 401 without token', async () => {
            const response = await request(app).get(
                `/accounts/${accountId}/transactions`
            );

            expect(response.status).toBe(401);
            expect(response.body.error.code).toBe('UNAUTHENTICATED');
        });

        it('should return 404 for non-existent account', async () => {
            const response = await request(app)
                .get('/accounts/nonexistent-id/transactions')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.error.code).toBe('NOT_FOUND');
        });
    });
});
