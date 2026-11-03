import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Admin from '../models/Admin';
import { asyncHandler } from '../utils/asyncHandler';
import { JWT_SECRET, tokenOptions } from '../config/jwtConfig';

// ADMIN LOGIN
export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role
      },
      JWT_SECRET,
      tokenOptions
    );

    const { password: _, ...rest } = admin.dataValues;

    res.json({
      message: 'Admin login successful',
      token,
      admin: rest
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
