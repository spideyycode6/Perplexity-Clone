import { initializeSocketConnection } from "../services/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../services/chat.api";
import { useDispatch, useSelector } from "react-redux";
import { createNewChat, addNewMessage, setCurrentChat, setLoading, setError, setChats, setMessages, removeChat } from "../chat.slice";

export function useChat() {
    const dispatch = useDispatch();
    const chats = useSelector((state) => state.chat.chats);

    const handleSendMessage = async ({ message, chatId }) => {
        let tempChatId = null;
        try {
            // 1. Show user message instantly (before API call)
            if (chatId && chats[chatId]) {
                // Existing chat: add message directly
                dispatch(addNewMessage({ chatId, message: { role: "user", content: message } }));
            } else {
                // New chat: create a temp chat so user sees their message immediately
                tempChatId = 'temp_' + Date.now();
                dispatch(createNewChat({ chatId: tempChatId, title: "New Chat" }));
                dispatch(addNewMessage({ chatId: tempChatId, message: { role: "user", content: message } }));
                dispatch(setCurrentChat(tempChatId));
            }

            // 2. Start loading & call API
            dispatch(setLoading(true));
            const data = await sendMessage({ message, chatId });
            const { chat, aiMessage } = data;

            const effectiveChatId = chat?._id || chatId;

            // 3. If we used a temp chat, replace it with the real one
            if (tempChatId) {
                dispatch(removeChat(tempChatId));
                dispatch(createNewChat({ chatId: effectiveChatId, title: chat?.title || "New Chat" }));
                dispatch(addNewMessage({ chatId: effectiveChatId, message: { role: "user", content: message } }));
            }

            // 4. Add AI response & finish
            dispatch(addNewMessage({ chatId: effectiveChatId, message: aiMessage }));
            dispatch(setCurrentChat(effectiveChatId));
            dispatch(setLoading(false));
        } catch (error) {
            console.error("handleSendMessage error:", error);
            // Clean up temp chat on error
            if (tempChatId) {
                dispatch(removeChat(tempChatId));
            }
            dispatch(setError(error?.response?.data?.message || error.message || "An unknown error occurred"));
            dispatch(setLoading(false));
        }
    }

    const handleGetChats = async () => {
        try {
            dispatch(setLoading(true));
            const { chats } = await getChats();
            dispatch(setChats(chats.reduce((acc, chat) => {
                acc[chat._id] = {
                    _id: chat._id,
                    title: chat.title || "New Chat",
                    messages: []
                }
                return acc;
            }, {})));
            dispatch(setLoading(false));
        } catch (error) {
            console.log(error);
            dispatch(setError(error));
            dispatch(setLoading(false));
        }
    }

    const handleSelectChat = async (chatId) => {
        try {
            dispatch(setCurrentChat(chatId));
            dispatch(setLoading(true));
            const { messages } = await getMessages(chatId);
            dispatch(setMessages({ chatId, messages }));
            dispatch(setLoading(false));
        } catch (error) {
            console.log(error);
            dispatch(setError(error));
            dispatch(setLoading(false));
        }
    }
    const handleDeleteChat = async (chatId) => {
        try {
            dispatch(setLoading(true));
            await deleteChat(chatId);
            dispatch(setChats(chats.filter(chat => chat._id !== chatId)));
            dispatch(setLoading(false));
        } catch (error) {
            console.log(error);
            dispatch(setError(error.message || "An unknown error occurred"));
            dispatch(setLoading(false));
        }
    }

    return { initializeSocketConnection, handleSendMessage, handleGetChats, handleSelectChat, handleDeleteChat };
}
