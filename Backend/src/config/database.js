import mongoose from 'mongoose';

export const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 12_000,
            connectTimeoutMS: 12_000,
        });
        console.log('✓ Database connected successfully');
    } catch (error) {
        console.error('✗ Database connection failed:', error.message);
        setTimeout(connectDatabase, 5000);
    }
};
