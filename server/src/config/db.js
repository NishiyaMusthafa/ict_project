import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in environment variables.');
    console.log('👉 Please set MONGODB_URI in your server/.env file (e.g., MongoDB Atlas connection string).');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('💡 Tip: Ensure your MongoDB Atlas cluster allows your IP address (0.0.0.0/0) or that local MongoDB is running.');
    return false;
  }
};

export const getDbStatus = () => {
  return {
    connected: isConnected,
    state: mongoose.connection.readyState // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
  };
};

export default connectDB;
