import { Router } from 'express';
import { addToCart, getCart, removeFromCart, updateCartItem } from '../controllers/cartController';
import { authMiddleware } from '../middleware/authMiddleware';

const router: Router = Router();

// All cart routes should be authenticated
router.post('/', authMiddleware, addToCart);
router.get('/', authMiddleware, getCart);
router.delete('/:id', authMiddleware, removeFromCart);
router.put('/:id', authMiddleware, updateCartItem);

export default router;
