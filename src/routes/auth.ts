// Authentication routes: POST /auth/register, POST /auth/login
import { Router, Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { validate } from '../middleware/validate';

const router = Router();

// POST /auth/register
router.post(
    '/register',
    validate({
        name: { required: true, type: 'string', minLength: 2, maxLength: 100 },
        email: { required: true, type: 'email' },
        password: { required: true, type: 'string', minLength: 6 },
    }),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, email, password } = req.body;
            const user = await authService.register(name, email, password);

            res.status(201).json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                },
            });
        } catch (err) {
            next(err);
        }
    }
);

// POST /auth/login
router.post(
    '/login',
    validate({
        email: { required: true, type: 'email' },
        password: { required: true, type: 'string' },
    }),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
            const { token, user } = await authService.login(email, password);

            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                },
            });
        } catch (err) {
            next(err);
        }
    }
);

export default router;
