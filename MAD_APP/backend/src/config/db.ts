import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
        console.error('MongoDB URI is not defined in environment variables');
        process.exit(1);  // Exit if no URI is provided
    }

    try {
        await mongoose.connect(mongoURI);  // No need to specify options anymore
        console.log('MongoDB Connected');
    } catch (err) {
        if (err instanceof Error) {
            console.error('MongoDB Connection Error:', err.message);
        } else {
            console.error('Unknown MongoDB connection error', err);
        }
        process.exit(1);
    }
};

export default connectDB;
