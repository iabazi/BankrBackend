// Authentication guard middleware
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            email?: string;
        }
    }
}

export function authGuard(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            error: {
                code: 'UNAUTHENTICATED',
                message: 'Missing or invalid authorization header',
            },
        });
        return;
    }

    const token = authHeader.substr(7);

    try {
        const payload = authService.verifyToken(token);
        req.userId = payload.userId;
        req.email = payload.email;
        next();
    } catch (err: unknown) {
        const error = err as { code?: string; message?: string; statusCode?: number };
        res.status(error.statusCode || 401).json({
            error: {
                code: error.code || 'UNAUTHENTICATED',
                message: error.message || 'Invalid token',
            },
        });
    }
}
