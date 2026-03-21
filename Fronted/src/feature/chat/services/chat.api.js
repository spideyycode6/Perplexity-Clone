import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})

export const sendMessage = async({message,chatId})=>{
    // Backend reads req.body.chat, not req.body.chatId
    const response = await api.post("/api/chats/message",{message, chat: chatId});
    return response.data
}

export const getChats = async()=>{
    const response = await api.get("/api/chats");
    return response.data
}

export const getMessages = async(chatId)=>{
    // Backend route is GET /api/chats/:chatId (not /api/chats/:chatId/messages)
    const response = await api.get(`/api/chats/${chatId}`);
    return response.data
}

export const deleteChat = async(chatId)=>{
    // Backend route is DELETE /api/chats/delete/:chatId
    const response = await api.delete(`/api/chats/delete/${chatId}`);
    return response.data
}