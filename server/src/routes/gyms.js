import express from "express";
import {
  createGym,
  getGyms,
  getGym,
  inviteStaff
} from "../controllers/gymController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireGymRole } from "../middleware/gymAuth.js";

const router = express.Router();

router.post("/", protect, createGym);

router.get("/", protect, getGyms);

router.get(
  "/:gymId",
  protect,
  requireGymRole("owner", "admin", "staff"),
  getGym
);

router.post(
  "/:gymId/staff",
  protect,
  requireGymRole("owner", "admin"),
  inviteStaff
);
export default router;