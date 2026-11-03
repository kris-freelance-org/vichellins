import { Router } from 'express';
import { adminLogin } from '../controllers/adminAuthController';

const router = Router();

// Login route - public
router.post('/login', adminLogin);

export default router;
