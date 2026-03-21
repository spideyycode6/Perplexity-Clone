// ─── 1. Third-party imports ───────────────────────────────────────────────────
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// ─── 2. Local imports (routes) ────────────────────────────────────────────────
import { router as authRouter } from './routes/auth.routes.js';
import chatRouter from './routes/chat.routes.js';



// ─── 3. Initialize app ────────────────────────────────────────────────────────
const app = express();



// ─── 4. Built-in middleware ───────────────────────────────────────────────────
app.use(express.json());           // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods:['GET','POST','PUT','DELETE']
}));




// ─── 5. Third-party middleware ────────────────────────────────────────────────
app.use(cookieParser());           // Parse cookies from request headers



// ─── 6. Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/chats', chatRouter);



// ─── 7. Utility routes ────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});


// ─── 8. Export ────────────────────────────────────────────────────────────────
export default app;
