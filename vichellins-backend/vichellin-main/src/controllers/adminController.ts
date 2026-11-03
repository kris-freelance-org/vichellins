import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

import { asyncHandler } from '../utils/asyncHandler';
import Admin from '../models/Admin';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import Category from '../models/Category';
import { AuthRequest } from '../middleware/authMiddleware';
import sequelize from '../config/database';
import constants from '../utils/constants';
import getS3Instance from '../utils/s3';
import { paginateQuery, paginateResult } from '../utils/paginate';
import getMailInstance from '../services/mail/mailer';
import getTemplate from '../services/mail/getTemplate';

// Dashboard statistics (admin only)
export const getDashboardStats = asyncHandler(async (_req: AuthRequest, res: Response) => {
  try {
    const totalAdmins = await Admin.count();
    const totalUsers = await User.count();
    const totalProducts = await Product.count();
    const totalOrders = await Order.count();

    // Get recent orders
    const recentOrders = await Order.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Get order analytics for the selected period
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Last 7 days

    const orderAnalytics = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate
        }
      },
      attributes: ['createdAt', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['createdAt']
    });

    res.json({
      stats: {
        totalAdmins,
        totalUsers,
        totalProducts,
        totalOrders
      },
      recentOrders,
      orderAnalytics
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get all users (admin only)
export const getAllUsers = asyncHandler(async (_req: AuthRequest, res: Response) => {
  try {
    const page = Number(_req.query.page ?? 1);
    const size = Number(_req.query.size ?? 10);

    const users = await User.findAndCountAll(
      paginateQuery(
        {
          attributes: { exclude: ['password'] }
        },
        { page, size }
      )
    );

    const result = paginateResult(users, { page, size });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export const searchUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.query;
    const page = Number(req.query.page ?? 1);
    const size = Number(req.query.size ?? 10);

    const users = await User.findAndCountAll(
      paginateQuery(
        {
          where: {
            name: {
              [Op.iLike]: `%${name}%`
            }
          }
        },
        { page, size }
      )
    );

    const result = paginateResult(users, { page, size });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get user by ID (admin only)
export const getUserById = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Delete user (admin only)
export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully', user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Manage categories (for future implementation)
export const getCategories = asyncHandler(async (_req: AuthRequest, res: Response) => {
  try {
    // This would require implementing a Category model
    res.json({ message: 'Category functionality to be implemented' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ORDERS
export const getOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { delivery_status, user_id } = req.query;
    const page = Number(req.query.page ?? 1);
    const size = Number(req.query.size ?? 10);

    const where: any = {};

    if (user_id) {
      where.user_id = user_id;
    }

    if (delivery_status) {
      where.delivery_status = delivery_status;
    }

    const orders = await Order.findAndCountAll(
      paginateQuery(
        {
          where,
          order: [['createdAt', 'DESC']]
        },
        { page, size }
      )
    );

    const result = paginateResult(orders, { page, size });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get order details (admin only)
export const getOrderDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {});

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Update order
export const updateOrderDetails = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { delivery_status, payment_status } = req.body;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.delivery_status === 'Cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    if (delivery_status && !payment_status) {
      await order.update({ delivery_status });
    } else if (payment_status && !delivery_status) {
      await order.update({ payment_status });
    } else if (delivery_status && payment_status) {
      await order.update({ delivery_status, payment_status });
    } else {
      res.status(400).json({ message: 'Invalid order update request' });
    }

    res.json({ message: 'Order updated', order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// PRODUCT MANAGEMENT (ADMIN ONLY)

// Update product stock
export const updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const productId = req.params.id;
    const { name, price, stock, categoryId, description } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    if (categoryId) {
      const categoryExists = await Category.findByPk(categoryId);
      if (!categoryExists) {
        return res.status(400).json({ message: `Category with ID ${String(categoryId).trim()} not found` });
      }
    }

    const product = await Product.findByPk(productId, { include: [{ model: Category, as: 'category' }] });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (description) product.description = description;
    if (categoryId) product.categoryId = categoryId;

    if (files) {
      let mainImagePromise, rightImagePromise, leftImagePromise, extraImagePromise;

      if (files.mainImage) mainImagePromise = getS3Instance().putObject(`products/${product.id}/main`, files.mainImage[0].buffer, files.mainImage[0].mimetype);
      if (files.rightImage) rightImagePromise = getS3Instance().putObject(`products/${product.id}/right`, files.rightImage[0].buffer, files.rightImage[0].mimetype);
      if (files.leftImage) leftImagePromise = getS3Instance().putObject(`products/${product.id}/left`, files.leftImage[0].buffer, files.leftImage[0].mimetype);
      if (files.extraImage) extraImagePromise = getS3Instance().putObject(`products/${product.id}/extra`, files.extraImage[0].buffer, files.extraImage[0].mimetype);

      const promises = [mainImagePromise, rightImagePromise, leftImagePromise, extraImagePromise].filter((p) => !!p);
      await Promise.all(promises);

      if (mainImagePromise) product.mainImage = getS3Instance().fullUrl(`products/${product.id}/main`);
      if (rightImagePromise) product.rightImage = getS3Instance().fullUrl(`products/${product.id}/right`);
      if (leftImagePromise) product.leftImage = getS3Instance().fullUrl(`products/${product.id}/left`);
      if (extraImagePromise) product.extraImage = getS3Instance().fullUrl(`products/${product.id}/extra`);
    }

    await product.save();

    const updatedProduct = await Product.findByPk(productId, { include: [{ model: Category, as: 'category' }] });

    res.json({
      message: 'Stock updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get out of stock products
export const getOutOfStockProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page ?? 1);
    const size = Number(req.query.size ?? 10);

    const products = await Product.findAndCountAll(
      paginateQuery(
        {
          where: { stock: 0 },
          include: [{ model: Category, as: 'category' }]
        },
        { page, size }
      )
    );

    const result = paginateResult(products, { page, size });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get products by price range
export const getProductsByPriceRange = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { minPrice, maxPrice } = req.query;
    const page = Number(req.query.page ?? 1);
    const size = Number(req.query.size ?? 10);

    const products = await Product.findAndCountAll(
      paginateQuery(
        {
          where: {
            price: {
              [Op.between]: [parseFloat(minPrice as string) || 0, parseFloat(maxPrice as string) || 9999999]
            }
          },
          include: [{ model: Category, as: 'category' }]
        },
        { page, size }
      )
    );

    const result = paginateResult(products, { page, size });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// PRODUCTS
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { name, price, stock, categoryId, description } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    if (!files?.mainImage) {
      return res.status(400).json({ message: 'Main product image is required' });
    }

    if (categoryId) {
      const categoryExists = await Category.findByPk(categoryId);
      if (!categoryExists) {
        return res.status(400).json({ message: `Category with ID ${String(categoryId).trim()} not found` });
      }
    } else {
      return res.status(400).json({ message: 'categoryId is required' });
    }

    const newProduct = await Product.create({ name, price, categoryId, description, stock }, { include: [{ model: Category, as: 'category' }] });

    let rightImagePromise, leftImagePromise, extraImagePromise;
    const mainImagePromise = getS3Instance().putObject(`products/${newProduct.id}/main`, files.mainImage[0].buffer, files.mainImage[0].mimetype);

    if (files.rightImage) rightImagePromise = getS3Instance().putObject(`products/${newProduct.id}/right`, files.rightImage[0].buffer, files.rightImage[0].mimetype);
    if (files.leftImage) leftImagePromise = getS3Instance().putObject(`products/${newProduct.id}/left`, files.leftImage[0].buffer, files.leftImage[0].mimetype);
    if (files.extraImage) extraImagePromise = getS3Instance().putObject(`products/${newProduct.id}/extra`, files.extraImage[0].buffer, files.extraImage[0].mimetype);

    const promises = [mainImagePromise, rightImagePromise, leftImagePromise, extraImagePromise].filter((p) => !!p);
    await Promise.all(promises);

    const toUpdate: any = { mainImage: getS3Instance().fullUrl(`products/${newProduct.id}/main`) };
    if (rightImagePromise) toUpdate.rightImage = getS3Instance().fullUrl(`products/${newProduct.id}/right`);
    if (leftImagePromise) toUpdate.leftImage = getS3Instance().fullUrl(`products/${newProduct.id}/left`);
    if (extraImagePromise) toUpdate.extraImage = getS3Instance().fullUrl(`products/${newProduct.id}/extra`);

    await newProduct.update(toUpdate);
    res.status(201).json({ product: newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export const getAllProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page ?? 1);
    const size = Number(req.query.size ?? 10);

    const products = await Product.findAndCountAll(
      paginateQuery(
        {
          order: [['createdAt', 'DESC']],
          include: [{ model: Category, as: 'category' }]
        },
        { page, size }
      )
    );

    const result = paginateResult(products, { page, size });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export const removeProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { mainImage, rightImage, leftImage, extraImage } = product;
    const toDelete = [mainImage, rightImage, leftImage, extraImage].filter((i) => !!i).map((i) => getS3Instance().deleteObject(i!, 4));
    await Promise.all(toDelete);

    await product.destroy();
    res.json({ message: 'Product removed successfully', product });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export const getProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, { include: [{ model: Category, as: 'category' }] });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product fetched successfully', product });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export const searchProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.query;
    const page = Number(req.query.page ?? 1);
    const size = Number(req.query.size ?? 10);

    const productsWithCategory = await Product.findAndCountAll(
      paginateQuery(
        {
          where: {
            name: {
              [Op.iLike]: `%${name}%`
            }
          },
          include: [{ model: Category, as: 'category' }]
        },
        { page, size }
      )
    );

    const result = paginateResult(productsWithCategory, { page, size });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ADMIN

// Get Admin Profile (Self)
export const getAdminProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user!.id;
    const admin = await Admin.findByPk(adminId, {
      attributes: { exclude: ['password'] }
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Update Admin Profile (Self)
export const updateAdminProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone } = req.body;

    const adminId = req.user!.id;
    const admin = await Admin.findByPk(adminId, {
      attributes: { exclude: ['password'] }
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    admin.name = name;
    admin.email = email;
    admin.phone = phone;
    await admin.save();

    res.json({ message: 'Admin profile updated', admin });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ADMIN MANAGEMENT

// Register Admin (Only super admins can do this)
export const registerAdmin = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { SuperAdmin, Manager, Staff } = constants.adminRole;

    // Further restrict creation of other admins to Super Admin alone
    if (!req.user || req.user.role !== SuperAdmin) {
      return res.status(400).json({ message: 'Access denied. Super Admin privileges required' });
    }

    const { name, email, password, phone, role } = req.body;

    if (!(email && password)) {
      return res.status(400).json({ message: 'Email and password is required' });
    }

    if (![SuperAdmin, Manager, Staff].includes(role)) {
      return res.status(400).json({ message: 'Invalid role received' });
    }

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || 'Staff'
    });

    const { password: _, ...rest } = newAdmin.dataValues;

    getMailInstance()
      .sendMailApi({
        to: email,
        subject: 'Welcome to the Admin Panel',
        html: getTemplate('registeredAdmin', { name, email, password })
      })
      .then(() => {
        console.log('Welcome email sent successfully');
      })
      .catch((error) => {
        console.error('Error sending welcome email:', error);
      });

    res.status(201).json({
      message: 'Admin registered successfully',
      admin: rest
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Forgot password implementation
export const forgotPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body;
    let admin, user;

    // Check if admin exists
    admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const resetOtpExpiry = new Date(Date.now() + 15 * 60 * 1000); // expires in 15 minutes

    if (admin) {
      await admin.update({ resetOtp, resetOtpExpiry });
    } else {
      await user!.update({ resetOtp, resetOtpExpiry });
    }

    getMailInstance()
      .sendMailApi({
        to: email,
        subject: 'Password Reset OTP',
        html: getTemplate('passwordResetOtp', {
          name: admin ? admin.name : user!.name,
          otp: resetOtp,
          expiresIn: '15 minutes'
        })
      })
      .then(() => {
        res.json({ message: 'Password reset email sent' });
      })
      .catch((error) => {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ error: (error as Error).message });
      });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Reset Password implementation
export const resetPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { otp, password } = req.body;
  let admin, user;

  // Validate request
  if (!(otp && password)) {
    return res.status(400).json({ message: 'OTP and new password are required' });
  }

  // Check if admin exists
  admin = await Admin.findOne({ where: { resetOtp: String(otp) } });
  if (!admin) {
    user = await User.findOne({ where: { resetOtp: String(otp) } });
    if (!user) {
      return res.status(404).json({ message: 'Invalid OTP' });
    }
  }

  // Check otp expiry
  if (admin && admin.resetOtpExpiry < new Date()) {
    return res.status(400).json({ message: 'OTP has expired' });
  } else if (user && user.resetOtpExpiry < new Date()) {
    return res.status(400).json({ message: 'OTP has expired' });
  }

  // Update password
  const hashedPassword = await bcrypt.hash(password, 10);
  admin
    ? await admin.update({ password: hashedPassword, resetOtp: null, resetOtpExpiry: null })
    : await user!.update({ password: hashedPassword, resetOtp: null, resetOtpExpiry: null });

  res.status(200).json({ message: 'Password reset successfully' });
});

// Get all admins
export const getAllAdmins = asyncHandler(async (_req: AuthRequest, res: Response) => {
  try {
    const page = Number(_req.query.page ?? 1);
    const size = Number(_req.query.size ?? 10);

    const admins = await Admin.findAndCountAll(
      paginateQuery(
        {
          attributes: { exclude: ['password'] },
          order: [['createdAt', 'DESC']]
        },
        { page, size }
      )
    );
    res.json({ admins });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get an Admin Profile
export const getAnAdminProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.params.id;
    const admin = await Admin.findByPk(adminId, {
      attributes: { exclude: ['password'] }
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({ admin });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Update and Admin Profile
export const updateAnAdminProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { SuperAdmin, Manager, Staff } = constants.adminRole;
    const { name, email, phone, role } = req.body;

    // Further restrict update of other admins to Super Admin alone
    if (!req.user || req.user.role !== SuperAdmin) {
      return res.status(400).json({ message: 'Access denied. Super Admin privileges required' });
    }

    if (![SuperAdmin, Manager, Staff].includes(role)) {
      return res.status(400).json({ message: 'Invalid role received' });
    }

    const adminId = req.params.id;
    const admin = await Admin.findByPk(adminId, {
      attributes: { exclude: ['password'] }
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    admin.name = name;
    admin.email = email;
    admin.phone = phone;
    admin.role = role;
    await admin.save();

    res.json({ message: 'Admin profile updated', admin });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Delete an Admin
export const deleteAnAdmin = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    // Further restrict deletion of other admins to Super Admin alone
    if (!req.user || req.user.role !== constants.adminRole.SuperAdmin) {
      return res.status(400).json({ message: 'Access denied. Super Admin privileges required' });
    }

    const { id } = req.params;
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (admin.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    await admin.destroy();
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// CATEGORY MANAGEMENT

// Create a new category (admin only)
export const createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    const file = req.file as Express.Multer.File | undefined;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    if (!file) {
      return res.status(400).json({ message: 'Category image is required' });
    }

    const category = await Category.create({ name, description });

    await getS3Instance().putObject(`categories/${category.id}`, file.buffer, file.mimetype);
    await category.update({
      image: getS3Instance().fullUrl(`categories/${category.id}`)
    });

    res.status(201).json({ category });
  } catch (error) {
    if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Category name already exists' });
    }
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get all categories (public/admin)
export const getAllCategories = asyncHandler(async (_req: Request, res: Response) => {
  try {
    const page = Number(_req.query.page ?? 1);
    const size = Number(_req.query.size ?? 10);

    const categories = await Category.findAndCountAll(
      paginateQuery(
        {
          order: [['name', 'ASC']]
        },
        { page, size }
      )
    );

    const result = paginateResult(categories, { page, size });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get category by ID (public/admin)
export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ category });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Update a category (admin only)
export const updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const file = req.file as Express.Multer.File | undefined;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;

    if (file && file.buffer) {
      await getS3Instance().putObject(`categories/${category.id}`, file.buffer, file.mimetype);
      category.image = getS3Instance().fullUrl(`categories/${category.id}`);
    }

    await category.save();
    res.json({ message: 'Category updated successfully', category });
  } catch (error) {
    if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Category name already exists' });
    }
    res.status(500).json({ error: (error as Error).message });
  }
});

// Delete a category (admin only)
export const deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.image) {
      await getS3Instance().deleteObject(category.image, 3);
    }

    await category.destroy();
    res.json({ message: 'Category deleted successfully', category });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export const searchCategories = asyncHandler(async (req: AuthRequest, res: Response) => {
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
