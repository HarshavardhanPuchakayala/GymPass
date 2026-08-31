
import express from "express";

import {
  createMember,
  getMembers,
  getMember,
  updateMember,
  deleteMember,
  getMembersByDueStatus,
  getMyMember,
} from "../controllers/memberController.js";

import { memberLogin } from "../controllers/memberAuthController.js";

import {
  recordPayment,
  getPayments,
} from "../controllers/paymentController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireGymRole } from "../middleware/gymAuth.js";
import protectMember from "../middleware/protectMember.js";

const router = express.Router({
  mergeParams: true,
});

/*
 * ============================================================
 * MEMBER AUTH
 * ============================================================
 */

/*
 * Member login
 *
 * Public route.
 * A member does not have a token yet, so this MUST come
 * before the staff protect/requireGymRole middleware.
 *
 * POST /api/gyms/:gymId/members/member-login
 */
router.post("/member-login", memberLogin);

/*
 * Logged-in member's own dashboard/profile.
 *
 * Protected by the member JWT.
 *
 * GET /api/gyms/:gymId/members/me
 */
router.get("/me", protectMember, getMyMember);


/*
 * ============================================================
 * STAFF MEMBER MANAGEMENT
 * ============================================================
 *
 * Everything below this point requires staff authentication
 * and an appropriate gym role.
 */

router.use(
  protect,
  requireGymRole("owner", "admin", "staff")
);

router.post("/", createMember);

router.get("/due-status", getMembersByDueStatus);

router.get("/", getMembers);

/*
 * Keep /me before /:memberId so "me" is not interpreted
 * as a memberId.
 */
router.get("/:memberId", getMember);

router.put("/:memberId", updateMember);

router.delete("/:memberId", deleteMember);


/*
 * ============================================================
 * PAYMENTS
 * ============================================================
 */

router.post(
  "/:memberId/payments",
  recordPayment
);

router.get(
  "/:memberId/payments",
  getPayments
);

export default router;