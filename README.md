# 🔍 Perplexity Clone

A full-stack AI-powered search and chat application inspired by [Perplexity AI](https://perplexity.ai). Built with React, Redux, Node.js, and Express — featuring real-time conversations powered by Google Gemini & Mistral AI with automatic model fallback.

![Tech Stack](https://img.shields.io/badge/React-19-blue?logo=react) ![Node.js](https://img.shields.io/badge/Node.js-22-green?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb) ![Express](https://img.shields.io/badge/Express-5-lightgrey?logo=express)

## ✨ Features

- 🤖 **Dual AI Models** — Google Gemini 2.0 Flash + Mistral Small with automatic fallback
- 💬 **Real-time Chat** — Socket.IO powered live conversations
- 🔐 **JWT Authentication** — Secure login & registration with cookie-based auth
- 🎨 **Premium Dark UI** — Glassmorphism, gradients, and micro-animations
- 📱 **Fully Responsive** — Mobile-first design with collapsible sidebar
- 📝 **Markdown Rendering** — AI responses with rich formatting (code blocks, lists, headings)
- 🗂️ **Chat History** — Persistent conversations with auto-generated titles
- ⚡ **Optimistic UI** — Instant message display before API response

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Redux Toolkit, React Router, Tailwind CSS, Vite |
| **Backend** | Node.js, Express 5, Socket.IO |
| **Database** | MongoDB with Mongoose |
| **AI** | LangChain, Google Gemini, Mistral AI |
| **Auth** | JWT, bcryptjs, cookie-parser |

## 📁 Project Structure

```
Perplexity-Clone/
├── Backend/
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── services/      # AI service (Gemini + Mistral)
│   │   ├── sockets/       # Socket.IO setup
│   │   ├── app.js         # Express app
│   │   └── server.js      # Entry point
│   ├── .env.example
│   └── package.json
├── Fronted/
│   ├── src/
│   │   ├── feature/
│   │   │   ├── auth/      # Login & Register
│   │   │   └── chat/      # Chat UI, hooks, Redux slice
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local or Atlas)
- API keys: [Google Gemini](https://aistudio.google.com/apikey), [Mistral AI](https://console.mistral.ai/api-keys)

### 1. Clone the repository

```bash
git clone https://github.com/spideyycode6/Perplexity-Clone.git
cd Perplexity-Clone
```

### 2. Setup Backend

```bash
cd Backend
npm install
cp .env.example .env
# Edit .env with your actual API keys and MongoDB URI
```

### 3. Setup Frontend

```bash
cd Fronted
npm install
```

### 4. Run the app

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd Backend
npm run dev

# Terminal 2 — Frontend
cd Fronted
npm run dev
```

The app will be available at **http://localhost:5173**

## 🔑 Environment Variables

Create a `.env` file in the `Backend/` directory. See [`.env.example`](Backend/.env.example) for all required variables:

| Variable | Description |
|----------|------------|
| `PORT` | Server port (default: 3000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `GEMINI_API_KEY` | Google Gemini API key |
| `MISTRAL_API_KEY` | Mistral AI API key |
| `TAVILY_API_KEY` | Tavily search API key |

## 📸 Screenshots

<!-- Add screenshots of your app here -->

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ by [@spideyycode6](https://github.com/spideyycode6)
