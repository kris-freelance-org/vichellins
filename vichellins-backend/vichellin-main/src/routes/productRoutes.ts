import express, { Router, RequestHandler } from 'express';
import { getProducts, getProductById, searchProducts, searchCategories } from '../controllers/productController';

const router: Router = express.Router();

// Public operations
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/categories/search', searchCategories);
router.get('/:id', getProductById);

export default router;
