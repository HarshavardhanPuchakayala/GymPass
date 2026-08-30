
import express from "express";

import {
  getStaff,
  inviteStaff,
} from "../controllers/gymController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGymRole } from "../middleware/gymAuth.js";

const router = express.Router({ mergeParams: true });

router.use(
  protect,
  requireGymRole("owner", "admin", "staff")
);

router.get("/", protect, requireGymRole("owner", "admin"), getStaff);

router.post(
  "/invite",
  protect,
  requireGymRole("owner", "admin"),
  inviteStaff
);
export default router;
