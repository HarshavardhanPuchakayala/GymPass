import express from "express";

import {
  checkInMember,
  getCheckIns,
} from "../controllers/checkInController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGymRole } from "../middleware/gymAuth.js";

const router = express.Router({
  mergeParams: true,
});

// Protect all check-in routes
router.use(
  protect,
  requireGymRole("owner", "admin", "staff")
);

// Check in a member
router.post("/", checkInMember);

// Get all check-ins
router.get("/", getCheckIns);

export default router;