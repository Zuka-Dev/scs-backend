import prisma from "../database/prisma.js";

export const getStats = async (req, res) => {
  try {
    const totalComplaints = await prisma.complaint.count();
    const pending = await prisma.complaint.count({
      where: { status: "Pending" },
    });
    const inProgress = await prisma.complaint.count({
      where: { status: "In Progress" },
    });
    const resolved = await prisma.complaint.count({
      where: { status: "Resolved" },
    });

    const recentComplaints = await prisma.complaint.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    const totalUsers = await prisma.user.count();
    const students = await prisma.user.count({ where: { role: "student" } });
    const admins = await prisma.user.count({ where: { role: "admin" } });

    res.json({
      stats: { totalComplaints, pending, inProgress, resolved },
      recentComplaints,
      users: { total: totalUsers, students, admins },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Dashboard stats fetch failed" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        complaints: true,
      },
    });

    const transformed = users.map((user) => ({
      id: user.matricNumber || `A${user.id}`,
      name: user.name,
      email: user.email,
      role: user.role === "admin" ? "Admin" : "Student",
      status: "Active", // You can enhance with real status logic later
      joinDate: user.createdAt?.toISOString().split("T")[0] || "-",
      complaintsCount: user.complaints.length,
    }));

    res.json({ success: true, users: transformed });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Failed to get users" });
  }
};
