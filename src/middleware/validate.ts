// Validation middleware
import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../models/types';

export interface ValidationRules {
    [key: string]: {
        required?: boolean;
        type?: 'string' | 'number' | 'boolean' | 'email';
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
    };
}

function isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function validate(rules: ValidationRules) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const errors: string[] = [];

        for (const [field, rule] of Object.entries(rules)) {
            const value = req.body[field];

            // Check required
            if (rule.required && (value === undefined || value === null || value === '')) {
                errors.push(`${field} is required`);
                continue;
            }

            if (value === undefined || value === null) {
                continue;
            }

            // Check type
            if (rule.type && rule.type !== 'email' && typeof value !== rule.type) {
                errors.push(`${field} must be a ${rule.type}`);
                continue;
            }

            // Check string length
            if (rule.type === 'string') {
                if (rule.minLength && value.length < rule.minLength) {
                    errors.push(`${field} must be at least ${rule.minLength} characters`);
                }
                if (rule.maxLength && value.length > rule.maxLength) {
                    errors.push(`${field} must be at most ${rule.maxLength} characters`);
                }
            }

            // Check email format
            if (rule.type === 'email' && !isValidEmail(String(value))) {
                errors.push(`${field} must be a valid email`);
            }

            // Check number range
            if (rule.type === 'number') {
                if (rule.min !== undefined && value < rule.min) {
                    errors.push(`${field} must be at least ${rule.min}`);
                }
                if (rule.max !== undefined && value > rule.max) {
                    errors.push(`${field} must be at most ${rule.max}`);
                }
            }
        }

        if (errors.length > 0) {
            const response: ErrorResponse = {
                error: {
                    code: 'INVALID_INPUT',
                    message: errors.join('; '),
                },
            };
            res.status(400).json(response);
            return;
        }

        next();
    };
}
