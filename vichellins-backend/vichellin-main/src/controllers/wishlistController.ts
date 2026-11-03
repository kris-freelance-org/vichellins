import { Response } from 'express';

import Wishlist from '../models/Wishlist';
import { asyncHandler } from '../utils/asyncHandler';
import { paginateQuery, paginateResult } from '../utils/paginate';
import { AuthRequest } from '../middleware/authMiddleware';
import { Product } from '../models';

export const addToWishlist = asyncHandler(async (_req: AuthRequest, res: Response) => {
  try {
    const { product_id } = _req.body;
    const user_id = _req.user?.id;

    let item = await Wishlist.findOne({
      where: { product_id, user_id }
    });
    if (item) {
      return res.status(400).json({ message: 'Item is already on your wishlist' });
    }

    item = await Wishlist.create(
      { user_id: _req.user?.id, product_id },
      {
        include: [{ model: Product, as: 'product' }]
      }
    );

    await item.reload();
    res.status(201).json({ data: item });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export const getWishlist = asyncHandler(async (_req: AuthRequest, res: Response) => {
  try {
    const page = Number(_req.query.page ?? 1);
    const size = Number(_req.query.size ?? 10);

    const wishlist = await Wishlist.findAndCountAll(
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
    const result = paginateResult(wishlist, { page, size });
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export const removeFromWishlist = asyncHandler(async (_req: AuthRequest, res: Response) => {
  try {
    const { id } = _req.params;
    const user_id = _req.user?.id;

    const item = await Wishlist.findByPk(id, { include: [{ model: Product, as: 'product' }] });

    if (!item || item.user_id !== user_id) {
      return res.status(400).json({ message: 'Item is not on wishlist' });
    }

    await item.destroy();

    res.json({ item });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
});
