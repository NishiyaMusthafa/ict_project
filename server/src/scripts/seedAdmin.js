import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    console.log('🚀 Connecting to MongoDB to create Initial Admin...');
    const connected = await connectDB();
    if (!connected) {
      console.error('❌ Could not connect to database. Please check your MONGODB_URI in server/.env');
      process.exit(1);
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@campus.edu';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@LostLoop123';
    const adminName = process.env.ADMIN_NAME || 'Campus Administrator';

    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });

    if (existingAdmin) {
      console.log(`⚠️ Admin account already exists with email: ${adminEmail}`);
      console.log(`Role: ${existingAdmin.role}`);
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log(`✅ Updated existing user ${adminEmail} to have "admin" role.`);
      }
      process.exit(0);
    }

    const admin = await User.create({
      name: adminName,
      email: adminEmail.toLowerCase(),
      password: adminPassword,
      role: 'admin',
      department: 'Campus Security & Student Services',
      phone: '+1 (555) 019-2834'
    });

    console.log('\n=========================================');
    console.log('🎉 INITIAL ADMIN ACCOUNT CREATED SUCCESSFULLY!');
    console.log('=========================================');
    console.log(`👤 Name:     ${admin.name}`);
    console.log(`📧 Email:    ${admin.email}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(`🛡️  Role:     ${admin.role}`);
    console.log('=========================================\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

seedAdmin();
