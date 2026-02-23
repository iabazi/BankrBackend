// Main application file
import express, { Express } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import fs from 'fs';
import YAML from 'yaml';

import { authGuard } from './middleware/authGuard';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth';
import meRoutes from './routes/me';
import accountRoutes from './routes/accounts';
import transactionRoutes from './routes/transactions';
import transferRoutes from './routes/transfers';

const app: Express = express();

// Middleware
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(
    cors({
        origin: corsOrigin.split(',').map((origin) => origin.trim()),
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Load and serve OpenAPI/Swagger documentation
const openapiPath = path.join(__dirname, 'docs/openapi.yaml');
if (fs.existsSync(openapiPath)) {
    const openapiFile = fs.readFileSync(openapiPath, 'utf8');
    const swaggerDocument = YAML.parse(openapiFile);

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Routes
app.use('/auth', authRoutes);
app.use('/me', authGuard, meRoutes);
app.use('/accounts', authGuard, accountRoutes);
app.use('/accounts', authGuard, transactionRoutes);
app.use('/transfers', authGuard, transferRoutes);

// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        error: {
            code: 'NOT_FOUND',
            message: 'Endpoint not found',
        },
    });
});

// Error handler - must be last
app.use(errorHandler);

export default app;
