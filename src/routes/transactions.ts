// Transaction routes: GET /accounts/:id/transactions?limit=20&cursor=<id>
import { Router, Request, Response, NextFunction } from 'express';
import { accountService } from '../services/accountService';
import { transactionService } from '../services/transactionService';
import { parsePaginationParams, paginate } from '../utils/paging';

const router = Router();

// GET /accounts/:id/transactions - Get transactions for an account (paginated)
router.get(
    '/:id/transactions',
    (req: Request, res: Response, next: NextFunction): void => {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const { limit, cursor } = req.query;

            if (!userId) {
                res.status(401).json({
                    error: {
                        code: 'UNAUTHENTICATED',
                        message: 'User not authenticated',
                    },
                });
                return;
            }

            // Verify account ownership
            accountService.verifyAccountOwnership(id, userId);

            // Get transactions
            const transactions = transactionService.getTransactionsByAccountId(id);

            // Parse pagination params
            const paginationParams = parsePaginationParams(
                limit as string | undefined,
                cursor as string | undefined
            );

            // Paginate results
            const paginatedResult = paginate(
                transactions,
                paginationParams.limit,
                paginationParams.cursor
            );

            res.json({
                data: paginatedResult.data,
                cursor: paginatedResult.nextCursor,
                hasMore: paginatedResult.hasMore,
            });
        } catch (err) {
            next(err);
        }
    }
);

export default router;
