// Transfer routes: POST /transfers
import { Router, Request, Response, NextFunction } from 'express';
import { transferService } from '../services/transferService';
import { validate } from '../middleware/validate';

const router = Router();

router.post(
    '/',
    validate({
        fromAccountId: { required: true, type: 'string' },
        toAccountId: { required: true, type: 'string' },
        amount: { required: true, type: 'number', min: 0.01 },
        note: { required: false, type: 'string' },
    }),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'User not authenticated' } });
                return;
            }

            const { fromAccountId, toAccountId, amount, note } = req.body;
            const idempotencyKey = req.headers['idempotency-key'] as string | undefined;

            const transfer = await transferService.createTransfer(
                fromAccountId, toAccountId, userId, amount, note, idempotencyKey
            );

            res.status(201).json(transfer);
        } catch (err) {
            next(err);
        }
    }
);

export default router;
