// Server entry point
import 'dotenv/config';
import app from './app';
import { seedService } from './services/seedService';

const PORT = process.env.PORT || 3000;

async function startServer(): Promise<void> {
    try {
        // Create tables if they don't exist, then seed initial data
        await seedService.initSchema();
        await seedService.seed();

        const server = app.listen(PORT, () => {
            console.log(`✓ Server running on http://localhost:${PORT}`);
            console.log(`✓ API Docs available at http://localhost:${PORT}/docs`);
        });

        process.on('SIGTERM', () => {
            server.close(() => process.exit(0));
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
