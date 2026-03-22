# Perplexity Clone

A full-stack AI-powered search and chat application inspired by [Perplexity AI](https://www.perplexity.ai). Built with React, Redux, Node.js, and Express — featuring real-time conversations powered by Google Gemini and Mistral AI with automatic model fallback.

![Tech Stack](https://img.shields.io/badge/React-19-blue?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-22-green?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb) ![Express](https://img.shields.io/badge/Express-5-lightgrey?logo=express)

## Phase 1 — Single-server deployment

Phase 1 reduces hosting cost by serving the **production React build** from the **same Express process** as the API (one URL, one server).

| Mode | Frontend | Backend | Use case |
|------|----------|---------|----------|
| **Development** | Vite dev server (`http://localhost:5173`) | `http://localhost:3000` | Hot reload, fast iteration |
| **Production-style** | Static files in `Backend/public/` | `http://localhost:3000` | Same as many cloud deploys |

Behavior in this phase:

- API routes live under `/api/*`; the SPA is served from `Backend/public` with a **fallback to `index.html`** for client-side routes (`/login`, `/register`, `/`, etc.).
- Requests to `/index.html` are **redirected to `/`** so React Router matches correctly.
- The frontend uses **`VITE_API_BASE_URL`** in dev (defaults to `http://localhost:3000`) and **same-origin** (empty base URL) when you open the app from the backend port after a production build.
- Auth cookies use **`secure: true` only in production**, so login works over `http://localhost` during local testing.

### Build frontend into `Backend/public`

From the **repository root**:

**PowerShell (Windows)**

```powershell
cd Fronted
npm run build
Copy-Item -Path dist\* -Destination ..\Backend\public\ -Recurse -Force
```

**Bash**

```bash
cd Fronted && npm run build && cp -r dist/* ../Backend/public/
```

Then start only the backend and open **`http://localhost:3000`** (use `/` or `/login`, not `/index.html`).

> Re-run the build and copy whenever you change the frontend, so `Backend/public` stays in sync. The committed `public` folder in this repo is a snapshot from the last Phase 1 build; refresh it before deploy if you changed the UI.

## Features

- **Dual AI models** — Google Gemini 2.0 Flash + Mistral Small with automatic fallback
- **Real-time chat** — Socket.IO
- **Authentication** — Register, email verification (Gmail SMTP / app password), JWT in httpOnly cookie
- **UI** — Dark theme, responsive layout, markdown-style answers
- **Chat history** — Persistent conversations with MongoDB

## Tech stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Redux Toolkit, React Router, Tailwind CSS, Vite |
| **Backend** | Node.js, Express 5, Socket.IO |
| **Database** | MongoDB (Mongoose) |
| **AI** | LangChain, Google Gemini, Mistral AI |

## Project structure

```
Perplexity-Clone/
├── Backend/
│   ├── public/            # Phase 1: production SPA assets (from Fronted build)
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── Fronted/
│   ├── src/
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Getting started

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)
- API keys: [Google Gemini](https://aistudio.google.com/apikey), [Mistral AI](https://console.mistral.ai/api-keys), [Tavily](https://tavily.com/) (if used)

### Clone and install

```bash
git clone https://github.com/spideyycode6/Perplexity-Clone.git
cd Perplexity-Clone
```

**Backend**

```bash
cd Backend
npm install
cp .env.example .env
# Edit .env (MongoDB URI, JWT, AI keys, email — see below)
```

**Frontend (for development)**

```bash
cd Fronted
npm install
```

### Run — development (two terminals)

```bash
# Terminal 1
cd Backend && npm run dev

# Terminal 2
cd Fronted && npm run dev
```

Open **`http://localhost:5173`**. The dev server proxies API calls to the backend URL configured in the frontend (default `http://localhost:3000`).

### Run — single server (after build)

```bash
cd Backend && npm run dev
```

Open **`http://localhost:3000`**.

## Environment variables

Create `Backend/.env` (see [`Backend/.env.example`](Backend/.env.example)).

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default `3000`) |
| `NODE_ENV` | `development` or `production` (affects cookie `secure`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` / `JWT_EXPIRY` | JWT signing |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins (defaults include `5173` and `3000`) |
| `PUBLIC_API_URL` | Public API base URL for links in emails (e.g. verify link) |
| `GOOGLE_USER` | Gmail address for outgoing mail |
| `GMAIL_APP_PASSWORD` or `GOOGLE_APP_PASSWORD` | Gmail [app password](https://support.google.com/accounts/answer/185833) |
| `GEMINI_API_KEY`, `MISTRAL_API_KEY`, `TAVILY_API_KEY` | AI / search |

**Frontend (optional)**

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Override API origin in Vite dev (default `http://localhost:3000`) |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push and open a Pull Request

## License

This project is open source under the [MIT License](LICENSE).

---

Built by [@spideyycode6](https://github.com/spideyycode6)
