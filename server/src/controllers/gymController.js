import Gym from "../models/Gym.js";
import StaffMembership from "../models/staffMembership.js";
import User from "../models/User.js";
export const createGym = async (req, res) => {
  try {
    const { name, address, phone } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Gym name is required",
      });
    }

    const gym = await Gym.create({
      name,
      address,
      phone,
    });

    await StaffMembership.create({
      user: req.userId,
      gym: gym._id,
      role: "owner",
    });

    res.status(201).json({
      message: "Gym created successfully",
      gym,
    });
  } catch (error) {
    console.error("Create gym error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getGyms = async (req, res) => {
  try {
    const memberships = await StaffMembership.find({
      user: req.userId,
    }).populate("gym");

    const gyms = memberships.map((membership) => membership.gym);

    res.json({ gyms });
  } catch (error) {
    console.error("Get gyms error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getGym = async (req, res) => {
  try {
    if (!req.staffMembership) {
      return res.status(500).json({ message: "Membership context missing" });
    }

    const gym = await Gym.findById(req.staffMembership.gym);

    if (!gym) {
      return res.status(404).json({ message: "Gym not found" });
    }

    res.json({ gym });
  } catch (error) {
    console.error("Get gym error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const inviteStaff = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({
        message: "Email and role are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!["admin", "staff"].includes(role)) {
      return res.status(400).json({
        message: "Role must be admin or staff",
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        message:
          "No account exists with this email. They need to sign up first.",
      });
    }

    const existingMembership = await StaffMembership.findOne({
      user: user._id,
      gym: gymId,
    });

    if (existingMembership) {
      return res.status(409).json({
        message: "User is already a member of this gym",
      });
    }

    const membership = await StaffMembership.create({
      user: user._id,
      gym: gymId,
      role,
    });

    return res.status(201).json({ membership });
  } catch (error) {
    console.error("Invite staff error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};