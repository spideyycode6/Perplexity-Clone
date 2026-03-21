/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║         PERPLEXITY AI - PROJECT DOCUMENTATION                 ║
 * ║           Conversational AI Chat Application                  ║
 * ╚═══════════════════════════════════════════════════════════════╝
 * 
 * PROJECT OVERVIEW
 * ================
 * Perplexity AI is a full-stack web application that enables real-time
 * conversations between users and an AI assistant. Users can create multiple
 * chat sessions, each containing a thread of messages with AI responses.
 * 
 * 
 * DATABASE SCHEMA
 * ===============
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │                           USER                              │
 * ├─────────────────────────────────────────────────────────────┤
 * │ ✓ _id              : ObjectId (Primary Key)                 │
 * │ ✓ username         : String (Unique, 3-30 chars)            │
 * │ ✓ email            : String (Unique, Valid Email)           │
 * │ ✓ password         : String (Hashed with bcrypt)            │
 * │ ✓ verified         : Boolean (Email verification status)    │
 * │ ✓ createdAt        : Date (Auto-generated)                  │
 * │ ✓ updatedAt        : Date (Auto-updated)                    │
 * └─────────────────────────────────────────────────────────────┘
 *              ↓ (One-to-Many)
 * ┌─────────────────────────────────────────────────────────────┐
 * │                           CHAT                              │
 * ├─────────────────────────────────────────────────────────────┤
 * │ ✓ _id              : ObjectId (Primary Key)                 │
 * │ ✓ user             : ObjectId (Ref to User)                 │
 * │ ✓ title            : String (Chat topic/name)               │
 * │ ✓ createdAt        : Date (Conversation start time)         │
 * │ ✓ updatedAt        : Date (Last activity time)              │
 * └─────────────────────────────────────────────────────────────┘
 *              ↓ (One-to-Many)
 * ┌─────────────────────────────────────────────────────────────┐
 * │                          MESSAGE                            │
 * ├─────────────────────────────────────────────────────────────┤
 * │ ✓ _id              : ObjectId (Primary Key)                 │
 * │ ✓ chat             : ObjectId (Ref to Chat)                 │
 * │ ✓ content          : String (Message text, up to 10000 chars)
 * │ ✓ role             : String (Either "user" or "AI")         │
 * │ ✓ createdAt        : Date (When message was sent)           │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * 
 * RELATIONSHIPS
 * =============
 * 1. User (1) ──→ (Many) Chat
 *    - One user can have multiple chats
 *    - Enables multi-session conversations
 * 
 * 2. Chat (1) ──→ (Many) Message
 *    - One chat contains multiple messages
 *    - Maintains conversation thread integrity
 * 
 * 3. User indirectly has access to all Messages through Chat
 * 
 * 
 * KEY FEATURES
 * ============
 * ✓ User Authentication - Secure login with email verification
 * ✓ Password Hashing - bcryptjs for secure password storage
 * ✓ Multi-Chat Sessions - Users can have multiple conversations
 * ✓ Message Threading - Organized conversation history
 * ✓ Role-Based Messages - Track which entity (user/AI) sent message
 * ✓ Timestamps - Track when messages and chats are created/updated
 * ✓ Data Validation - Input validation at schema level
 * ✓ Database Indexing - Optimized queries for common operations
 * 
 * 
 * TECHNOLOGY STACK
 * ================
 * Backend:
 *   - Node.js - JavaScript runtime
 *   - Express.js - Web framework
 *   - MongoDB - NoSQL database
 *   - Mongoose - MongoDB ODM (Object Data Mapping)
 *   - bcryptjs - Password hashing library
 * 
 * Features:
 *   - RESTful API
 *   - JWT Authentication (recommended)
 *   - Real-time messaging (Socket.io ready)
 *   - Secure password storage
 * 
 * 
 * API ENDPOINTS (Suggested)
 * =========================
 * 
 * AUTH ROUTES
 * -----------
 * POST   /auth/register           - Register new user
 * POST   /auth/login              - User login
 * POST   /auth/verify-email       - Verify user email
 * GET    /auth/profile            - Get current user profile
 * 
 * CHAT ROUTES
 * -----------
 * GET    /chats                   - Get all user chats
 * POST   /chats                   - Create new chat
 * GET    /chats/:chatId           - Get specific chat
 * PUT    /chats/:chatId           - Update chat title
 * DELETE /chats/:chatId           - Delete chat
 * 
 * MESSAGE ROUTES
 * --------------
 * GET    /chats/:chatId/messages  - Get all messages in chat
 * POST   /chats/:chatId/messages  - Create new message
 * DELETE /messages/:messageId     - Delete specific message
 * 
 * 
 * DATA VALIDATION RULES
 * =====================
 * 
 * USER SCHEMA:
 *   username:     3-30 characters, unique, alphanumeric + underscore
 *   email:        Valid email format, unique
 *   password:     Minimum 6 characters, hashed before storage
 *   verified:     Default false, updated after email verification
 * 
 * CHAT SCHEMA:
 *   user:         Required, must reference valid User
 *   title:        1-100 characters, required
 *   createdAt:    Auto-generated, immutable
 *   updatedAt:    Auto-updated on every change
 * 
 * MESSAGE SCHEMA:
 *   chat:         Required, must reference valid Chat
 *   content:      1-10000 characters, required, trimmed
 *   role:         Must be "user" or "AI", required
 *   createdAt:    Auto-generated, immutable
 * 
 * 
 * INDEX STRATEGY
 * ==============
 * The following indexes are created for optimal query performance:
 * 
 * User Collection:
 *   - username (unique)
 *   - email (unique)
 * 
 * Chat Collection:
 *   - user (for finding user's chats)
 *   - createdAt (for sorting)
 *   - Compound: { user: 1, createdAt: -1 } (user's chats, newest first)
 * 
 * Message Collection:
 *   - chat (for finding messages in a chat)
 *   - Compound: { chat: 1, createdAt: 1 } (messages in order)
 * 
 * 
 * SECURITY CONSIDERATIONS
 * =======================
 * ✓ Passwords are hashed with bcryptjs (10-salt rounds)
 * ✓ Email validation to prevent spam registrations
 * ✓ Unique constraints on username and email
 * ✓ JWT tokens (to be implemented) for stateless authentication
 * ✓ Input validation at schema level
 * ✓ Password field excluded from default query results (.select(false))
 * 
 * 
 * EXAMPLE USAGE
 * =============
 * 
 * // Create a new user
 * const user = new User({
 *   username: 'john_doe',
 *   email: 'john@example.com',
 *   password: 'securePassword123'
 * });
 * await user.save();
 * 
 * // Create a new chat for the user
 * const chat = new Chat({
 *   user: user._id,
 *   title: 'JavaScript Help Discussion'
 * });
 * await chat.save();
 * 
 * // Add messages to the chat
 * const userMessage = new Message({
 *   chat: chat._id,
 *   content: 'How do I use async/await?',
 *   role: 'user'
 * });
 * await userMessage.save();
 * 
 * const aiMessage = new Message({
 *   chat: chat._id,
 *   content: 'Async/await is a syntax for handling promises...',
 *   role: 'AI'
 * });
 * await aiMessage.save();
 * 
 * 
 * PROJECT STRUCTURE
 * ==================
 * PERPLEXITY/
 * ├── app.js                 # Root application file
 * ├── package.json           # Dependencies and scripts
 * ├── src/
 * │   ├── app.js             # Express app configuration
 * │   ├── server.js          # Server entry point
 * │   ├── config/
 * │   │   └── database.js    # MongoDB connection config
 * │   ├── controllers/       # Business logic handlers
 * │   ├── middleware/        # Express middlewares (auth, error handling)
 * │   ├── models/            # Mongoose schemas
 * │   │   ├── user.model.js
 * │   │   ├── chat.model.js
 * │   │   └── message.model.js
 * │   ├── routes/            # API route definitions
 * │   └── utils/             # Utility functions
 * 
 * 
 * NEXT STEPS
 * ==========
 * 1. Implement authentication controllers (register, login, verify)
 * 2. Create API routes for all CRUD operations
 * 3. Add middleware for authentication and error handling
 * 4. Implement chat controllers
 * 5. Implement message controllers
 * 6. Add real-time features with Socket.io
 * 7. Implement AI integration (OpenAI, Anthropic, etc.)
 * 8. Add logging and monitoring
 * 9. Write unit and integration tests
 * 10. Deploy to production
 * 
 * 
 * VERSION HISTORY
 * ===============
 * v1.0.0 - Initial schema design
 *   - User authentication model
 *   - Chat session model
 *   - Message threading model
 *   - Database relationships and indexing
 * 
 */

module.exports = {
  projectName: 'Perplexity AI',
  description: 'Conversational AI Chat Application',
  version: '1.0.0',
  models: {
    User: 'Authentication and user profile management',
    Chat: 'Chat session/conversation management',
    Message: 'Individual messages within chats'
  },
  database: 'MongoDB with Mongoose ODM'
};
