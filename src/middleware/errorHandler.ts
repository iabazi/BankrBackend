// Global error handler middleware
import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../models/types';

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    console.error('Error:', err);

    // Handle custom errors
    if (
        err &&
        typeof err === 'object' &&
        'code' in err &&
        'message' in err &&
        'statusCode' in err
    ) {
        const error = err as { code: string; message: string; statusCode: number };
        const response: ErrorResponse = {
            error: {
                code: error.code,
                message: error.message,
            },
        };
        res.status(error.statusCode).json(response);
        return;
    }

    // Handle unknown errors
    const response: ErrorResponse = {
        error: {
            code: 'INTERNAL_ERROR',
            message: 'Internal server error',
        },
    };
    res.status(500).json(response);
}
