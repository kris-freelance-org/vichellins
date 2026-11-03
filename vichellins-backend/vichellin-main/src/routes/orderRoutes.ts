import { Router } from 'express';
import { placeOrder, getOrders, cancelOrder } from '../controllers/orderController';
import { authMiddleware } from '../middleware/authMiddleware';

const router: Router = Router();

// All order routes should be authenticated
router.post('/', authMiddleware, placeOrder);
router.get('/', authMiddleware, getOrders);
router.delete('/:id', authMiddleware, cancelOrder); // orders are immutable, so can only be cancelled

export default router;
