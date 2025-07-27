import prisma from "../database/prisma.js";

// controllers/response.controllers.js
export const respondToComplaint = async (req, res) => {
  try {
    const { message, complaintId } = req.body;
    const complaintIdInt = parseInt(complaintId);

    const complaint = await prisma.complaint.findUnique({
      where: {
        id: complaintIdInt,
      },
    });

    if (!complaint) {
      return res
        .status(404)
        .json({ success: false, message: "Complaint not found" });
    }

    await prisma.response.create({
      data: {
        message,
        responder: "admin",
        complaintId: complaintIdInt,
      },
    });

    res.json({ success: true, message: "Response saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save response" });
  }
};
