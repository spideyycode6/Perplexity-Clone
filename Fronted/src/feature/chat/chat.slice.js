import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chats:{},
    currentChat:null,
    isLoading:false,
    error:null
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        createNewChat:(state,action)=>{
            const {chatId,title} = action.payload;
            state.chats[chatId] = {
                _id:chatId,
                title,
                messages:[]
            }
        },
        addNewMessage:(state,action)=>{
            const {chatId,message} = action.payload;
            state.chats[chatId].messages.push(message)
        },
       setChats:(state,action)=>{
        state.chats = action.payload
       },
       setCurrentChat:(state,action)=>{
        state.currentChat = action.payload
       },
       setMessages:(state,action)=>{
        const {chatId, messages} = action.payload;
        if(state.chats[chatId]){
          state.chats[chatId].messages = messages;
        }
       },
       setLoading:(state,action)=>{
        state.isLoading = action.payload
       },
       setError:(state,action)=>{
        state.error = action.payload
       },
       removeChat:(state,action)=>{
        const chatId = action.payload;
        delete state.chats[chatId];
        if(state.currentChat === chatId){
          state.currentChat = null;
        }
       }
    }
})

export const {createNewChat,addNewMessage,setChats,setCurrentChat,setMessages,setLoading,setError,removeChat} = chatSlice.actions
export default chatSlice.reducer