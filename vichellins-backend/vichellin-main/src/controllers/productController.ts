import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import { asyncHandler } from '../utils/asyncHandler';
import { paginateQuery, paginateResult } from '../utils/paginate';
import { Category } from '../models';
import { Op } from 'sequelize';

// Defining route parameters type
export interface ProductParams {
  id: string;
}

// GET ALL PRODUCTS (Already working)
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page ?? 1);
    const size = Number(req.query.size ?? 10);

    const products = await Product.findAndCountAll(
      paginateQuery(
        {
          include: [{ model: Category, as: 'category' }]
        },
        { page, size }
      )
    );

    const result = paginateResult(products, { page, size });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE PRODUCT
export const getProductById = asyncHandler(async (req: Request<ProductParams>, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const product = await Product.findByPk(id, { include: [{ model: Category, as: 'category' }] });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
});

export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { name, categoryId } = req.query;
    const page = Number(req.query.page ?? 1);
    const size = Number(req.query.size ?? 10);

    const where: any = {};

    if (name) {
      where.name = {
        [Op.iLike]: `%${name}%`
      };
    }

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    const products = await Product.findAndCountAll(
      paginateQuery(
        {
          where
        },
        { page, size }
      )
    );

    const result = paginateResult(products, { page, size });
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export const searchCategories = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    const page = Number(req.query.page ?? 1);
    const size = Number(req.query.size ?? 10);

    const condition: any = {};

    if (name) {
      condition.where = {
        name: {
          [Op.iLike]: `%${name}%`
        }
      };
    }

    const categories = await Category.findAndCountAll(paginateQuery(condition, { page, size }));

    const result = paginateResult(categories, { page, size });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
