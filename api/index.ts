import app from '../src/app';
import { seedService } from '../src/services/seedService';

let initialized = false;

async function ensureInitialized(): Promise<void> {
    if (!initialized) {
        await seedService.initSchema();
        await seedService.seed();
        initialized = true;
    }
}

export default async function handler(req: unknown, res: unknown): Promise<void> {
    try {
        await ensureInitialized();
        await app(req as never, res as never);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Failed to handle request:', message);
        throw error;
    }
}
