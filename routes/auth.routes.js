import express from "express";
import {
  loginUser,
  registerUser,
  getUserDetails,
} from "../controllers/auth.controllers.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/sign-up", registerUser);
router.post("/sign-in", loginUser);
router.get("/users/me", authenticateUser, getUserDetails);
export default router;
