/**
 * Message Model - Perplexity AI Project
 * 
 * This model stores individual messages within a chat conversation.
 * Each message has a sender role (user or AI) and the content of the message.
 * Messages are organized within chat sessions for conversation history.
 * 
 * Project Info:
 * - Supports role-based messaging (user or AI)
 * - Maintains complete conversation context
 * - Used for training and improving AI responses
 * - Enables conversation replay and analytics
 */

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat',
            required: [true, 'Chat ID is required'],
            index: true, // Index for fast message retrieval
        },
        content: {
            type: String,
            required: [true, 'Message content is required'],
            trim: true,
            maxlength: [10000, 'Message cannot exceed 10000 characters'],
            minlength: [1, 'Message cannot be empty'],
        },
        role: {
            type: String,
            enum: {
                values: ['user', 'ai'],
                message: 'Role must be either "user" or "ai"',
            },
            required: [true, 'Message role is required'],
        },
        createdAt: {
            type: Date,
            default: Date.now,
            immutable: true, // Cannot be changed after creation
        },
    },
    {
        timestamps: false, // We only use createdAt for messages
    }
);

// Index for retrieving messages in a chat, sorted by creation time
messageSchema.index({ chat: 1, createdAt: 1 });

export const messageModel = mongoose.model('Message', messageSchema);
