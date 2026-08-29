import MembershipPlan from "../models/MembershipPlan.js";
import Member from "../models/Member.js";

export const createPlan = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { name, duration, price } = req.body;

    if (!name || !duration || price === undefined) {
      return res.status(400).json({
        message: "Name, duration, and price are required",
      });
    }

    const plan = await MembershipPlan.create({
      gym: gymId,
      name: name.trim(),
      duration,
      price,
    });

    res.status(201).json({ plan });
  } catch (error) {
    console.error("Create plan error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({
      gym: req.params.gymId,
    });

    res.json({ plans });
  } catch (error) {
    console.error("Get plans error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findOne({
      _id: req.params.planId,
      gym: req.params.gymId,
    });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json({ plan });
  } catch (error) {
    console.error("Get plan error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findOneAndUpdate(
      {
        _id: req.params.planId,
        gym: req.params.gymId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json({ plan });
  } catch (error) {
    console.error("Update plan error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const { gymId, planId } = req.params;

    const memberCount = await Member.countDocuments({
      gym: gymId,
      membershipPlan: planId,
    });

    if (memberCount > 0) {
      return res.status(409).json({
        message: `Cannot delete this plan: ${memberCount} member${
          memberCount === 1 ? "" : "s"
        } currently use it. Reassign them first.`,
      });
    }

    const plan = await MembershipPlan.findOneAndDelete({
      _id: planId,
      gym: gymId,
    });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error("Delete plan error:", error);
    res.status(500).json({ message: "Server error" });
  }
};