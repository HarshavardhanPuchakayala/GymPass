import express from "express";

import {
  createPlan,
  getPlans,
  getPlan,
  updatePlan,
  deletePlan,
} from "../controllers/membershipPlanController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGymRole } from "../middleware/gymAuth.js";

const router = express.Router({ mergeParams: true });

router.use(
  protect,
  requireGymRole("owner", "admin", "staff")
);

router.post("/", createPlan);
router.get("/", getPlans);
router.get("/:planId", getPlan);
router.put("/:planId", updatePlan);
router.delete("/:planId", deletePlan);

export default router;