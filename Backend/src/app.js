// ─── 1. Third-party imports ───────────────────────────────────────────────────
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// ─── 2. Local imports (routes) ────────────────────────────────────────────────
import { router as authRouter } from './routes/auth.routes.js';
import chatRouter from './routes/chat.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.join(__dirname, '..', 'public');

// ─── 3. Initialize app ────────────────────────────────────────────────────────
const app = express();

// ─── 4. Built-in middleware ───────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

const corsOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
    : ['http://localhost:5173', 'http://localhost:3000'];

app.use(
    cors({
        origin: corsOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    })
);

// Avoid React Router path "/index.html" (no matching route) — normalize to "/"
app.get('/index.html', (req, res) => res.redirect(302, '/'));

// ─── 5. API & utility routes (before static + SPA fallback) ──────────────────
app.use('/api/auth', authRouter);
app.use('/api/chats', chatRouter);

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// ─── 6. Frontend static assets + SPA ────────────────────────────────────────
app.use(express.static(publicPath));

app.get(/.*/, (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        return next();
    }
    if (req.path.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(publicPath, 'index.html'), (err) => {
        if (err) next(err);
    });
});

// ─── 7. Export ────────────────────────────────────────────────────────────────
export default app;
