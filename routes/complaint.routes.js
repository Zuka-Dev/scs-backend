import express from "express"
const router = express.Router()
import  {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  getMyComplaints,
  updateComplaintStatus
} from "../controllers/complaint.controller.js"
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";


router.use(authenticateUser); // All routes protected

router.post("/", authorizeRoles("student"), createComplaint);
router.get("/", authorizeRoles("admin"), getAllComplaints);
router.get("/mine", authorizeRoles("student"), getMyComplaints);
router.get("/:id", authorizeRoles("student", "admin"), getComplaintById); // Get complaint by ID
router.patch("/:id", authorizeRoles("admin"), updateComplaintStatus);   // Admin updates complaint status



export default router