import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/authMiddleware';
import { JWT_SECRET, tokenOptions } from '../config/jwtConfig';

// REGISTER
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!(email && password)) {
      return res.status(400).json({ message: 'Email and password is required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone
    });

    res.status(201).json({
      message: 'User registered',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone
      }
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// LOGIN
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Generate JWT Token with admin status
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      JWT_SECRET,
      tokenOptions
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET USER PROFILE
export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// UPDATE USER PROFILE
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.user!;
    const { name, email, phone, password, street, city, state, country, zip } = req.body;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (street) user.street = street;
    if (city) user.city = city;
    if (state) user.state = state;
    if (country) user.country = country;
    if (zip) user.zip = zip;

    await user.save();

    res.json({ message: 'User profile updated', user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
