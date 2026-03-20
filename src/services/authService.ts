// Authentication service
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, JWTPayload } from '../models/types';
import { db } from '../models/db';
import { generateId } from '../utils/id';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

export class AuthService {
    async register(name: string, email: string, password: string): Promise<User> {
        const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            throw { code: 'INVALID_INPUT', message: 'Email already registered', statusCode: 400 };
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const id = generateId();
        const createdAt = new Date();

        await db.query(
            'INSERT INTO users (id, name, email, password_hash, created_at) VALUES ($1, $2, $3, $4, $5)',
            [id, name, email, passwordHash, createdAt]
        );

        return { id, name, email, passwordHash, createdAt };
    }

    async login(email: string, password: string): Promise<{ token: string; user: User }> {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            throw { code: 'UNAUTHENTICATED', message: 'Invalid email or password', statusCode: 401 };
        }

        const row = result.rows[0];
        const user: User = {
            id: row.id,
            name: row.name,
            email: row.email,
            passwordHash: row.password_hash,
            createdAt: row.created_at,
        };

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            throw { code: 'UNAUTHENTICATED', message: 'Invalid email or password', statusCode: 401 };
        }

        return { token: this.generateToken(user), user };
    }

    async getUserById(id: string): Promise<User | undefined> {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) return undefined;
        const row = result.rows[0];
        return { id: row.id, name: row.name, email: row.email, passwordHash: row.password_hash, createdAt: row.created_at };
    }

    generateToken(user: User): string {
        const payload: JWTPayload = { userId: user.id, email: user.email };
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d', algorithm: 'HS256' });
    }

    verifyToken(token: string): JWTPayload {
        try {
            return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as JWTPayload;
        } catch {
            throw { code: 'UNAUTHENTICATED', message: 'Invalid or expired token', statusCode: 401 };
        }
    }
}

export const authService = new AuthService();
