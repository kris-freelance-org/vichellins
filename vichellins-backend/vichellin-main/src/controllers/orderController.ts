import { Request, Response } from 'express';
import Order from '../models/Order';
import { asyncHandler } from '../utils/asyncHandler';
import { paginateQuery, paginateResult } from '../utils/paginate';
import { AuthRequest } from '../middleware/authMiddleware';
import { Cart, Category, Product } from '../models';
import { Op } from 'sequelize';

export const placeOrder = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { user_id, cart_item_ids } = req.body;

    const cartItems = await Cart.findAll({
      where: {
        id: {
          [Op.in]: [...cart_item_ids]
        }
      },
      include: [
        {
          model: Product,
          as: 'product',
          include: [{ model: Category, as: 'category' }]
        }
      ]
    });

    if (!cartItems || !cartItems.length) {
      return res.status(400).json({ message: 'No items in cart' });
    }

    const items = cartItems
      .filter((cartItem) => cartItem.user_id === user_id)
      .map((cartItem: any) => {
        console.log(cartItem.product.name);
        return {
          product_id: cartItem.product.id,
          product_name: cartItem.product.name,
          product_price: Number(cartItem.product.price),
          product_quantity: Number(cartItem.quantity),
          product_image: cartItem.product.mainImage,
          product_category: {
            name: cartItem.product.category.name,
            description: cartItem.product.category.description
          }
        };
      });

    if (!items || !items.length) {
      return res.status(400).json({ message: 'No items of yours in this cart' });
    }

    const total_amount = items.reduce((acc: number, item) => {
      acc += item.product_price * item.product_quantity;
      return acc;
    }, 0);

    const order = await Order.create({ user_id, items, total_amount });

    await Cart.destroy({
      where: {
        id: {
          [Op.in]: [...cart_item_ids]
        }
      }
    });

    res.status(201).json({ order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export const getOrders = asyncHandler(async (_req: AuthRequest, res: Response) => {
  try {
    const page = Number(_req.query.page ?? 1);
    const size = Number(_req.query.size ?? 10);

    const orders = await Order.findAndCountAll(
      paginateQuery(
        {
          where: {
            user_id: _req.user?.id
          }
        },
        { page, size }
      )
    );

    const result = paginateResult(orders, { page, size });
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.delivery_status === 'Cancelled') return res.status(400).json({ message: 'Order is already cancelled' });

    await order.update({ delivery_status: 'Cancelled' });

    res.json({ message: 'Order updated', order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
});
