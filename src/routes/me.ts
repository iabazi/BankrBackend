// User routes: GET /me
import { Router, Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'User not authenticated' } });
            return;
        }

        const user = await authService.getUserById(userId);
        if (!user) {
            res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
            return;
        }

        res.json({ id: user.id, name: user.name, email: user.email, createdAt: user.createdAt });
    } catch (err) {
        next(err);
    }
});

export default router;
