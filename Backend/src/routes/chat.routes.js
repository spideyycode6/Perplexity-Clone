import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { sendMessageController,getChatsController,getMessagesController,deleteChatController } from "../controllers/chat.controller.js";
const chatRouter = Router();

chatRouter.post("/message",authMiddleware,sendMessageController);
chatRouter.get("/",authMiddleware,getChatsController);
chatRouter.get("/:chatId",authMiddleware,getMessagesController);
chatRouter.delete("/delete/:chatId",authMiddleware,deleteChatController);
export default chatRouter;