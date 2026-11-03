import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { sequelize } from './models';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
import cartRoutes from './routes/cartRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import adminRoutes from './routes/adminRoutes';
import adminAuthRoutes from './routes/adminAuthRoutes';
import cors from 'cors';
import morgan from 'morgan';
import { forgotPassword, resetPassword } from './controllers/adminController';

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// route for the root path
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/api/run-seed', async (req: Request, res: Response): Promise<void> => {
  if (req.get('x-api-key') !== process.env.API_KEY) {
    res.status(403).send('Forbidden');
    return;
  }

  try {
    const module = await import('./scripts/seedAdmin');
    await module.default();
    res.send('Seeding complete');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).send('Seeding failed: ' + message);
  }
});

// API Routes
app.post('/api/forgot-password', forgotPassword);
app.post('/api/reset-password', resetPassword);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/wishlists', wishlistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin-auth', adminAuthRoutes);

// global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err.message });
});

const PORT = Number(process.env.PORT || 5050);
const HOST = '0.0.0.0';

app.listen(PORT, HOST, async () => {
  try {
    await sequelize.authenticate();
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error('Database Connection Error:', error);
  }
});
