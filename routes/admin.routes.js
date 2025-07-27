import express from "express";
import { getStats, getUsers } from "../controllers/admin.controllers.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/dashboard", getStats);
router.get("/users", getUsers);
export default router;
