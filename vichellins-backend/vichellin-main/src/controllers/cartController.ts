import { Response } from 'express';
import Cart from '../models/Cart';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/authMiddleware';
import { Product } from '../models';
import { paginateQuery, paginateResult } from '../utils/paginate';

export const addToCart = asyncHandler(async (_req: AuthRequest, res: Response) => {
  try {
    const { product_id, quantity } = _req.body;
    const user_id = _req.user?.id;

    let cartItem = await Cart.findOne({
      where: { product_id, user_id }
    });

    if (cartItem) {
      return res.status(400).json({ message: 'Item is already on your cart' });
    }

    cartItem = await Cart.create(
      { user_id, product_id, quantity },
      {
        include: [{ model: Product, as: 'product' }]
      }
    );

    await cartItem.reload();
    res.status(201).json({ cartItem });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export const getCart = asyncHandler(async (_req: AuthRequest, res: Response) => {
  try {
    const page = Number(_req.query.page ?? 1);
    const size = Number(_req.query.size ?? 10);

    const cart = await Cart.findAndCountAll(
      paginateQuery(
        {
          where: {
            user_id: _req.user?.id
          },
          include: [{ model: Product, as: 'product' }]
        },
        { page, size }
      )
    );

    const result = paginateResult(cart, { page, size });

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export const removeFromCart = asyncHandler(async (_req: AuthRequest, res: Response) => {
  try {
    const { id } = _req.params;
    const user_id = _req.user?.id;

    const cartItem = await Cart.findByPk(id, { include: [{ model: Product, as: 'product' }] });

    if (!cartItem || cartItem.user_id !== user_id) {
      return res.status(400).json({ message: 'Item is not on your cart' });
    }

    await cartItem.destroy();

    res.json({ message: 'Item removed from cart', cartItem });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export const updateCartItem = asyncHandler(async (_req: AuthRequest, res: Response) => {
  try {
    const { id } = _req.params;
    const user_id = _req.user?.id;
    const { quantity } = _req.body;

    const cartItem = await Cart.findByPk(id, { include: [{ model: Product, as: 'product' }] });

    if (!cartItem || cartItem.user_id !== user_id) {
      return res.status(400).json({ message: 'Item is not on your cart' });
    }

    await cartItem.update({ quantity });

    res.json({ message: 'Item updated', cartItem });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
});
