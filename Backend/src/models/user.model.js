/**
 * User Model - Perplexity AI Project
 * 
 * This model handles user authentication and profile management.
 * Stores user credentials, verification status, and timestamps.
 * 
 * Project Info:
 * - Name: Perplexity AI
 * - Type: AI Chat Application
 * - Purpose: Real-time conversational AI with message history
 * - Database: MongoDB with Mongoose ODM
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters long'],
            maxlength: [30, 'Username cannot exceed 30 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
            select: false, // Don't return password by default in queries
        },
        verified: {
            type: Boolean,
            default: false,
            description: 'Email verification status',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        console.error('Failed to hash password:', error.message);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (passwordToCheck) {
    return await bcrypt.compare(passwordToCheck, this.password);
};

export const userModel = mongoose.model('User', userSchema);
