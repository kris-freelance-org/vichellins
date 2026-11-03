import '../config/database';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();

import Admin from '../models/Admin';

const seedAdmin = async () => {
  try {
    console.log('Seeding Super Admin...');

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = 'Admin';
    const adminRole = 'Super Admin';

    if (!(adminEmail && adminPassword)) {
      console.log('Failed to seed admin, invalid details');
      return;
    }

    const existingAdmin = await Admin.findOne({ where: { email: adminEmail } });
    if (existingAdmin) {
      console.log(`Admin with email ${adminEmail} already exists.`);
      return;
    }

    console.log('Creating new admin...');
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const newAdmin = await Admin.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: adminRole
    });

    console.log(`Super Admin created with ID: ${newAdmin.id}`);
  } catch (error) {
    console.error('Error seeding admin:', error);
    throw error;
  }
};

export default seedAdmin;
