import { generateResponse, chatMessageTitle } from "../services/ai.service.js";
import { messageModel } from "../models/message.model.js";
import { chatModel } from "../models/chat.model.js";

export const sendMessageController = async (req, res) => {
    try {
        const { message, chat: chatId } = req.body;

        let title = null;
        let chat = null;

        if (!chatId) {
            title = await chatMessageTitle(message);
            chat = await chatModel.create({
                user: req.user.id,
                title: title
            });
        }

        const userMessage = await messageModel.create({
            chat: chatId || chat._id,
            content: message,
            role: 'user'
        });

        const messages = await messageModel.find({ chat: chatId || chat._id });
        const response = await generateResponse(messages);

        const aiMessage = await messageModel.create({
            chat: chatId || chat._id,
            content: response,
            role: 'ai'
        });

        return res.status(201).json({
            message: "Message sent successfully",
            success: true,
            chat,
            userMessage,
            aiMessage
        });
    } catch (error) {
        console.error("sendMessage error:", error.message);
        return res.status(500).json({
            message: error.message || "Failed to generate AI response",
            success: false
        });
    }
}

export const getChatsController = async (req, res) => {
    const user = req.user;
    const chats = await chatModel.find({ user: user.id });

    return res.status(200).json({
        message: "Chats retrieved successfully",
        success: true,
        chats
    });
}

export const getMessagesController = async (req, res) => {
    const { chatId } = req.params;

    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id
    });

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found",
            success: false
        });
    }

    const messages = await messageModel.find({ chat: chatId });

    return res.status(200).json({
        message: "Messages retrieved successfully",
        success: true,
        messages
    });


};

export const deleteChatController = async (req, res) => {
    const user = req.user;
    const { chatId } = req.params;

    const chat = await chatModel.findOne({
        _id: chatId,
        user: user.id
    });

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found",
            success: false
        });
    }

    await chatModel.deleteOne({
        _id: chatId,
        user: user.id
    });

    await messageModel.deleteMany({
        chat: chatId
    });

    return res.status(200).json({
        message: "Chat deleted successfully",
        success: true
    });

}
