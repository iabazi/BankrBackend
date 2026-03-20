// Account routes: GET /accounts, GET /accounts/:id
import { Router, Request, Response, NextFunction } from 'express';
import { accountService } from '../services/accountService';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'User not authenticated' } });
            return;
        }
        const accounts = await accountService.getAccountsByUserId(userId);
        res.json({ accounts });
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        if (!userId) {
            res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'User not authenticated' } });
            return;
        }
        const account = await accountService.verifyAccountOwnership(id, userId);
        res.json(account);
    } catch (err) {
        next(err);
    }
});

export default router;
