import StaffMembership from "../models/staffMembership.js";

export const requireGymRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { gymId } = req.params;

      if (!gymId) {
        return res.status(400).json({
          message: "Gym ID is required",
        });
      }

      const staffMembership = await StaffMembership.findOne({
        user: req.userId,
        gym: gymId,
      });

      if (!staffMembership) {
        return res.status(404).json({
          message: "Gym not found",
        });
      }

      if (!allowedRoles.includes(staffMembership.role)) {
        return res.status(403).json({
          message: "You are not authorized to perform this action",
        });
      }

      req.staffMembership = staffMembership;

      next();
    } catch (error) {
      console.error("Gym authorization error:", error);

      res.status(500).json({
        message: "Server error",
      });
    }
  };
};