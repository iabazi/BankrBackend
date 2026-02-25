import app from '../src/app';
import { seedService } from '../src/services/seedService';

let seeded = false;

async function ensureSeeded(): Promise<void> {
    if (!seeded) {
        await seedService.seed();
        seeded = true;
    }
}

export default async function handler(req: unknown, res: unknown): Promise<void> {
    try {
        await ensureSeeded();
        await app(req as never, res as never);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        // eslint-disable-next-line no-console
        console.error('Failed to handle request:', message);
        throw error;
    }
}
