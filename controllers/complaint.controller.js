import prisma from "../database/prisma.js";

// POST /complaints
export const createComplaint = async (req, res) => {
  const { category, description } = req.body;

  try {
    const complaint = await prisma.complaint.create({
      data: {
        category,
        description,
        userId: req.user.id,
      },
    });
    res.status(201).json({ message: "Complaint submitted", complaint });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit complaint" });
  }
};

// GET /complaints (admin)
export const getAllComplaints = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const complaints = await prisma.complaint.findMany({
      include: {
        user: true,
        responses: true,
      },
    });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
};

// GET /complaints/mine (student)
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      where: { userId: req.user.id },
      include: { responses: true },
    });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch your complaints" });
  }
};

export const getComplaintById = async (req, res) => {
  const { id } = req.params;

  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id: parseInt(id) },
      include: { responses: true },
    });
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch complaint" });
  }
};
// PATCH /complaints/:id
export const updateComplaintStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const updated = await prisma.complaint.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.json({ message: "Complaint status updated", updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};
