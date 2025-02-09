import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { sendMessage, getMessages,getUsersForsidebar } from '../controllers/message.controller.js';
const router = express.Router();    

router.get("/users", protectRoute, getUsersForsidebar);

router.get("/:id", protectRoute, getMessages);

router.post("/send", protectRoute, sendMessage);
export default router;
