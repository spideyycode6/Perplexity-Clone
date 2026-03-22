import { Server } from "socket.io";

let io;

const socketCorsOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
    : ["http://localhost:5173", "http://localhost:3000"];

export function initSocket(httpserver) {
    io = new Server(httpserver, {
        cors: {
            origin: socketCorsOrigins,
            credentials: true,
        },
    });
    
    console.log("Socket.io is Running");

    io.on("connection",(socket)=>{
        console.log("a user connected",socket.id);
    });
}

export function getIO(){
    if(!io){
        throw new Error("Socket.io not initialized");
    }
    return io;
}