import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log(' MongoDB connected successfully.');
  } catch (err) {
    console.error(' MongoDB connection error:', err);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
