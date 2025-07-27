// routes/chat.routes.js
import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { chatWithBot } from "../controllers/chatbot.controller.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", authenticateUser, authorizeRoles("student"), chatWithBot);

export default router;
