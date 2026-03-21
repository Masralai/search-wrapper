import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const mongo_URL = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/search-wrapper';

  try {
    const conn = await mongoose.connect(mongo_URL);
    if (conn) {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
