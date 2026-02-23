// User routes: GET /me
import { Router, Request, Response, NextFunction } from 'express';
import { store } from '../models/store';

const router = Router();

// GET /me - Get current user profile
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

        const user = store.getUserById(userId);
        if (!user) {
            res.status(404).json({
                error: {
                    code: 'NOT_FOUND',
                    message: 'User not found',
                },
            });
            return;
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        });
    } catch (err) {
        next(err);
    }
});

export default router;
