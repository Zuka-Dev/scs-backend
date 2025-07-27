import prisma from "../database/prisma.js"; // Adjust path if necessary
import { askAI } from "../utils/ai.js"; // Adjust path if necessary

export const chatWithBot = async (req, res) => {
  try {
    const { message, complaintId } = req.body;
    const msg = message.toLowerCase();

    // Check FAQ table for a match
    // Assuming 'fAQ' is a Prisma model, if Sequelize, adjust `prisma.fAQ.findMany()`
    const allFaqs = await prisma.fAQ.findMany();
    const matched = allFaqs.find((faq) =>
      msg.includes(faq.question.toLowerCase())
    );

    let botReply;
    let responseSource; // To indicate if response came from FAQ or AI

    if (matched) {
      botReply = matched.answer;
      responseSource = "faq";
    } else {
      // Fallback to the new Gemini-powered AI assistant
      botReply = await askAI(msg);
      responseSource = "gemini_ai"; // Indicate AI as the source
    }

    // Build the data object conditionally
    // Assuming 'response' is a Prisma model, if Sequelize, adjust `prisma.response.create()`
    const data = {
      message: botReply,
      responder: "bot", // Or "ai_assistant" if you want more specific tracking
      ...(complaintId ? { complaintId } : {}), // Conditionally add complaintId
    };

    await prisma.response.create({ data });

    res.json({
      from: responseSource, // Now dynamically indicates source
      response: botReply,
    });
  } catch (err) {
    console.error("Chatbot Error:", err);
    res.status(500).json({ error: "Chatbot error: " + err.message }); // Return error message to client
  }
};
