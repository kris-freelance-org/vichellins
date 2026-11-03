import express, { Router, Request } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';
import {
  // Dashboard
  getDashboardStats,
  // User Management
  getAllUsers,
  getUserById,
  deleteUser,
  searchUsers,
  // Order Management
  getOrders,
  getOrderDetails,
  updateOrderDetails,
  // Product Management
  getAllProducts,
  createProduct,
  removeProduct,
  updateProduct,
  getOutOfStockProducts,
  getProductsByPriceRange,
  getProduct,
  searchProducts,
  // Category Management
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  // Profile Management (Self)
  getAdminProfile,
  updateAdminProfile,
  // Admin Management
  registerAdmin,
  getAllAdmins,
  getAnAdminProfile,
  updateAnAdminProfile,
  deleteAnAdmin,
  searchCategories
} from '../controllers/adminController';
import multer from 'multer';

const router: Router = express.Router();

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Apply admin authentication middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard Routes
router.get('/dashboard', getDashboardStats);

// User Management Routes
router.get('/users', getAllUsers);
router.get('/users/search', searchUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

// Order Management Routes
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderDetails);
router.put('/orders/:id', updateOrderDetails);

// Product Management Routes
router.post(
  '/products',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'rightImage', maxCount: 1 },
    { name: 'leftImage', maxCount: 1 },
    { name: 'extraImage', maxCount: 1 }
  ]),
  createProduct
);
router.get('/products', getAllProducts);
router.delete('/products/:id', removeProduct);
router.put(
  '/products/:id',
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'rightImage', maxCount: 1 },
    { name: 'leftImage', maxCount: 1 },
    { name: 'extraImage', maxCount: 1 }
  ]),
  updateProduct
);
router.get('/products/out-of-stock', getOutOfStockProducts);
router.get('/products/price-range', getProductsByPriceRange);
router.get('/products/search', searchProducts);
router.get('/products/:id', getProduct);

// Profile Management Routes
router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);

// Admin Management Routes
router.post('/register', registerAdmin);
router.get('/admins', getAllAdmins);
router.get('/admins/:id', getAnAdminProfile);
router.put('/admins/:id', updateAnAdminProfile);
router.delete('/admins/:id', deleteAnAdmin);

// Category Management Routes
router.post('/categories', upload.single('image'), createCategory);
router.get('/categories', getAllCategories);
router.get('/categories/search', searchCategories);
router.get('/categories/:id', getCategoryById);
router.put('/categories/:id', upload.single('image'), updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;
