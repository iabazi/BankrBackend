// Authentication service
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, JWTPayload } from '../models/types';
import { store } from '../models/store';
import { generateId } from '../utils/id';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

export class AuthService {
    /**
     * Register a new user
     */
    async register(name: string, email: string, password: string): Promise<User> {
        // Check if email already exists
        const existing = store.getUserByEmail(email);
        if (existing) {
            throw {
                code: 'INVALID_INPUT',
                message: 'Email already registered',
                statusCode: 400,
            };
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user: User = {
            id: generateId(),
            name,
            email,
            passwordHash,
            createdAt: new Date(),
        };

        store.saveUser(user);
        return user;
    }

    /**
     * Authenticate user and return JWT token
     */
    async login(email: string, password: string): Promise<{ token: string; user: User }> {
        const user = store.getUserByEmail(email);
        if (!user) {
            throw {
                code: 'UNAUTHENTICATED',
                message: 'Invalid email or password',
                statusCode: 401,
            };
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            throw {
                code: 'UNAUTHENTICATED',
                message: 'Invalid email or password',
                statusCode: 401,
            };
        }

        // Generate JWT token
        const token = this.generateToken(user);

        return { token, user };
    }

    /**
     * Generate JWT token for user
     */
    generateToken(user: User): string {
        const payload: JWTPayload = {
            userId: user.id,
            email: user.email,
        };

        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: '7d',
            algorithm: 'HS256',
        });
    }

    /**
     * Verify and decode JWT token
     */
    verifyToken(token: string): JWTPayload {
        try {
            return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as JWTPayload;
        } catch (err) {
            throw {
                code: 'UNAUTHENTICATED',
                message: 'Invalid or expired token',
                statusCode: 401,
            };
        }
    }
}

export const authService = new AuthService();
