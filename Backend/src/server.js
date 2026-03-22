// 1. Environment variables - must be first
import dotenv from 'dotenv';
dotenv.config();
import http from 'http';

 

// 2. Local modules
import app from './app.js';
import { connectDatabase } from './config/database.js';
import { initSocket } from './sockets/server.socket.js';

const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(app);
initSocket(httpServer);

connectDatabase();
const startServer = async () => {
    try {
        httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
