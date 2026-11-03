import dotenv from 'dotenv';
import { SignOptions } from 'jsonwebtoken';
dotenv.config();

// JWT Settings
export const JWT_SECRET = String(process.env.JWT_SECRET);
export const JWT_EXPIRES_IN = '1d';

// Token generation options
export const tokenOptions: SignOptions = {
  expiresIn: JWT_EXPIRES_IN
};
