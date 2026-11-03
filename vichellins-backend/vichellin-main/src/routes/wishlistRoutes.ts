import { Router } from 'express';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlistController';
import { authMiddleware } from '../middleware/authMiddleware';

const router: Router = Router();

// All wishlist routes should be authenticated
router.post('/', authMiddleware, addToWishlist);
router.get('/', authMiddleware, getWishlist);
router.delete('/:id', authMiddleware, removeFromWishlist);

export default router;
