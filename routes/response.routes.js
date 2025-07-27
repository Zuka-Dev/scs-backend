// routes/response.routes.js
import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { respondToComplaint } from "../controllers/response.controllers.js";

const router = express.Router();

router.post("/", authenticateUser, authorizeRoles("admin"), respondToComplaint);
export default router;
