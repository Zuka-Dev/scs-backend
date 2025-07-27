// src/services/aiAssistant.js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

export const askAI = async (message) => {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("Missing GOOGLE_API_KEY in environment for AI assistant.");
  }

  // Choose a suitable Gemini model. 'gemini-1.5-flash-latest' is a good balance
  // of speed, cost, and capability, and was available in your ListModels output.
  const chatModel = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-1.5-flash-latest",
    temperature: 0.3, // A slightly higher temperature than detection for more natural responses
  });

  // Craft a prompt that guides the LLM on its role and expected behavior.
  // We'll provide it with some common complaint-related information it might need.
  const promptContent = `
You are an intelligent virtual assistant integrated into a university student complaint management system. 

Your job is to help students understand how to:
- File complaints
- Track or understand the status of their complaints
- Interpret responses from admins
- Know what actions to take next
- Understand general complaint procedures or expected timelines

Your tone should be friendly, professional, and student-focused. Avoid long explanations — keep responses concise and easy to follow.

Important guidelines:
- If the student's request is not clear, ask for clarification.
- If a request falls outside your knowledge or app functions, recommend contacting a university admin or checking the 'Help' or 'Support' section in the app.
- Do **not** generate fictional updates or guess specific complaint details.
- Assume students are using a mobile/web app that shows their complaints and updates.

Examples of what you can say:
- "To file a new complaint, go to the 'File Complaint' section and provide all required details."
- "Your complaint status is usually visible in the 'My Complaints' section, along with any updates."
- "Most complaints are reviewed within 3–5 working days."
- "Admins usually respond directly in the complaint thread. Keep checking for updates there."
- "If you're unsure how to proceed, try checking the app’s FAQ or contact an admin for help."

User’s message: "${message}"

Respond as the assistant:
`;

  const prompt = new HumanMessage({
    content: promptContent,
  });

  try {
    const response = await chatModel.invoke([prompt]);
    return response.content;
  } catch (error) {
    console.error("❌ Gemini AI assistant failed:", error.message);
    throw new Error(
      "Failed to get response from AI assistant: " + error.message
    );
  }
};
