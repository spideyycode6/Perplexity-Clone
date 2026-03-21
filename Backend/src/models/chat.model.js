/**
 * Chat Model - Perplexity AI Project
 * 
 * This model represents a conversation session between a user and the AI.
 * Each chat session contains multiple messages and belongs to a single user.
 * Tracks when chats are created and updated for better conversation management.
 * 
 * Project Info:
 * - Supports multi-turn conversations
 * - Each user can have multiple simultaneous chats
 * - Enables conversation history tracking and retrieval
 */

import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: [true, 'User ID is required'],
            index: true, // Index for faster queries
        },
        title: {
            type: String,
            required: [true, 'Chat title is required'],
            trim: true,
            maxlength: [100, 'Chat title cannot exceed 100 characters'],
            default: 'Untitled Conversation',
        },
        createdAt: {
            type: Date,
            default: Date.now,
            index: true, // Index for sorting by date
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

// Index for retrieving user's chats efficiently
chatSchema.index({ user: 1, createdAt: -1 });

// Middleware to update updatedAt before saving
chatSchema.pre('save', function () {
    this.updatedAt = new Date();
});

export const chatModel = mongoose.model('chat', chatSchema);
