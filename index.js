import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import chatbotRoutes from "./routes/chatbot.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import responseRoutes from "./routes/response.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import dotenv from "dotenv";
import prisma from "./database/prisma.js";
import { errorHandler } from "./middlewares/error.middleware.js";
dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorHandler);

app.listen(port, async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database");
  } catch (error) {
    console.error("❌ Database connection failed:", err);
  }
  console.log(`Server running at ${port}`);
});
