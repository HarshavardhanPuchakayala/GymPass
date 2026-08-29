import Member from "../models/Member.js";
import MembershipPlan from "../models/MembershipPlan.js";

export const createMember = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { name, email, phone, membershipPlan, dueDate } = req.body;

    if (!name || !membershipPlan || !dueDate) {
      return res.status(400).json({
        message: "Name, membership plan, and due date are required",
      });
    }

    const plan = await MembershipPlan.findOne({
      _id: membershipPlan,
      gym: gymId,
    });

    if (!plan) {
      return res.status(404).json({
        message: "Membership plan not found for this gym",
      });
    }

    const member = await Member.create({
      gym: gymId,
      name: name.trim(),
      email: email?.trim().toLowerCase(),
      phone,
      membershipPlan,
      dueDate,
    });

    res.status(201).json({ member });
  } catch (error) {
    console.error("Create member error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMembers = async (req, res) => {
  try {
    const members = await Member.find({
      gym: req.params.gymId,
    }).populate("membershipPlan");

    res.json({ members });
  } catch (error) {
    console.error("Get members error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMember = async (req, res) => {
  try {
    const member = await Member.findOne({
      _id: req.params.memberId,
      gym: req.params.gymId,
    }).populate("membershipPlan");

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json({ member });
  } catch (error) {
    console.error("Get member error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateMember = async (req, res) => {
  try {
    const { gymId, memberId } = req.params;

    if (req.body.membershipPlan) {
      const plan = await MembershipPlan.findOne({
        _id: req.body.membershipPlan,
        gym: gymId,
      });

      if (!plan) {
        return res.status(404).json({
          message: "Membership plan not found for this gym",
        });
      }
    }

    const member = await Member.findOneAndUpdate(
      { _id: memberId, gym: gymId },
      req.body,
      { new: true, runValidators: true }
    ).populate("membershipPlan");

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json({ member });
  } catch (error) {
    console.error("Update member error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findOneAndDelete({
      _id: req.params.memberId,
      gym: req.params.gymId,
    });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Delete member error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getMembersByDueStatus = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { status = "overdue" } = req.query;

    const now = new Date();

    let filter = {
      gym: gymId,
    };

    if (status === "overdue") {
      filter.dueDate = { $lt: now };
    } else if (status === "upcoming") {
      const threeDaysLater = new Date(now);
      threeDaysLater.setDate(threeDaysLater.getDate() + 3);

      filter.dueDate = {
        $gte: now,
        $lte: threeDaysLater,
      };
    } else {
      return res.status(400).json({
        message: "Invalid status. Use overdue or upcoming",
      });
    }

    const members = await Member.find(filter)
      .populate("membershipPlan")
      .sort({ dueDate: 1 });

    res.json({
      status,
      count: members.length,
      members,
    });
  } catch (error) {
    console.error("Get due status error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};