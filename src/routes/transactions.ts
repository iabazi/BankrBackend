// Transaction routes: GET /accounts/:id/transactions
import { Router, Request, Response, NextFunction } from 'express';
import { accountService } from '../services/accountService';
import { transactionService } from '../services/transactionService';

const router = Router();

router.get('/:id/transactions', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
        const cursor = req.query.cursor as string | undefined;

        if (!userId) {
            res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'User not authenticated' } });
            return;
        }

        await accountService.verifyAccountOwnership(id, userId);
        const result = await transactionService.getTransactionsByAccountId(id, limit, cursor);

        res.json({ data: result.data, cursor: result.cursor, hasMore: result.hasMore });
    } catch (err) {
        next(err);
    }
});

export default router;
