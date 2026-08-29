import express from "express";

import {
  createMember,
  getMembers,
  getMember,
  updateMember,
  deleteMember,
} from "../controllers/memberController.js";

import { recordPayment } from "../controllers/paymentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGymRole } from "../middleware/gymAuth.js";

const router = express.Router({
  mergeParams: true,
});


router.use(
  protect,
  requireGymRole("owner", "admin", "staff")
);

router.post("/", createMember);

router.get("/", getMembers);

router.get("/:memberId", getMember);

router.put("/:memberId", updateMember);

router.delete("/:memberId", deleteMember);


router.post(
  "/:memberId/payments",
  recordPayment
);

export default router;