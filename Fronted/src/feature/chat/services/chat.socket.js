import { io } from "socket.io-client";
import { getApiBaseURL } from "../../../config/apiOrigin.js";

export const initializeSocketConnection = () => {
    const socket = io(getApiBaseURL(), {
        withCredentials: true,
    });
    socket.on("connect",()=>{
        console.log("Socket connected");
    });
    socket.on("disconnect",()=>{
        console.log("Socket disconnected");
    });
}