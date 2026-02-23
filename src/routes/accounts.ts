// Account routes: GET /accounts, GET /accounts/:id
import { Router, Request, Response, NextFunction } from 'express';
import { accountService } from '../services/accountService';

const router = Router();

// GET /accounts - Get all accounts for authenticated user
router.get('/', (req: Request, res: Response, next: NextFunction): void => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({
                error: {
                    code: 'UNAUTHENTICATED',
                    message: 'User not authenticated',
                },
            });
            return;
        }

        const accounts = accountService.getAccountsByUserId(userId);
        res.json({ accounts });
    } catch (err) {
        next(err);
    }
});

// GET /accounts/:id - Get a specific account
router.get('/:id', (req: Request, res: Response, next: NextFunction): void => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({
                error: {
                    code: 'UNAUTHENTICATED',
                    message: 'User not authenticated',
                },
            });
            return;
        }

        const account = accountService.verifyAccountOwnership(id, userId);
        res.json(account);
    } catch (err) {
        next(err);
    }
});

export default router;
