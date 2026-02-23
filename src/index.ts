// Server entry point
import 'dotenv/config';
import app from './app';
import { seedService } from './services/seedService';

const PORT = process.env.PORT || 3000;

async function startServer(): Promise<void> {
    try {
        // Seed database on startup
        await seedService.seed();

        const server = app.listen(PORT, () => {
            console.log(`✓ Server running on http://localhost:${PORT}`);
            console.log(`✓ API Docs available at http://localhost:${PORT}/docs`);
            console.log(`✓ Android Emulator: http://10.0.2.2:${PORT}`);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM signal received: closing HTTP server');
            server.close(() => {
                console.log('HTTP server closed');
                process.exit(0);
            });
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
