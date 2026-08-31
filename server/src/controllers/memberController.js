import bcrypt from "bcrypt";
import Member from "../models/Member.js";
import MembershipPlan from "../models/MembershipPlan.js";
import CheckIn from "../models/CheckIn.js";
export const createMember = async (req, res) => {
  try {
    const { gymId } = req.params;
    const {
      name,
      email,
      phone,
      password,
      membershipPlan,
      dueDate,
    } = req.body;

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

    let hashedPassword;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const member = await Member.create({
      gym: gymId,
      name: name.trim(),
      email: email?.trim().toLowerCase(),
      phone,
      password: hashedPassword,
      membershipPlan,
      dueDate,
    });

    const memberResponse = member.toObject();
    delete memberResponse.password;

    res.status(201).json({
      member: memberResponse,
    });
  } catch (error) {
    console.error("Create member error:", error);

    // Duplicate email within the same gym
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A member with this email already exists in this gym",
      });
    }

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMyMember = async (req, res) => {
  try {
    const { memberId, gymId } = req;

    const member = await Member.findOne({
      _id: memberId,
      gym: gymId,
    }).populate("membershipPlan");

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    const checkIns = await CheckIn.find({
      gym: gymId,
      member: memberId,
    }).sort({
      createdAt: -1,
    });

    const memberData = member.toObject();

    // Never expose the password hash.
    delete memberData.password;

    res.json({
      member: {
        ...memberData,

        // The member's _id is their QR value.
        qrValue: member._id.toString(),

        // Real check-in history, newest first.
        checkIns,
      },
    });
  } catch (error) {
    console.error("Get my member error:", error);

    res.status(500).json({
      message: "Server error",
    });
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

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMember = async (req, res) => {
  try {
    const member = await Member.findOne({
      _id: req.params.memberId,
      gym: req.params.gymId,
    }).populate("membershipPlan");

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.json({ member });
  } catch (error) {
    console.error("Get member error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateMember = async (req, res) => {
  try {
    const { gymId, memberId } = req.params;

    // Password changes are intentionally not supported
    // through the general member update endpoint.
    const { password, ...updateData } = req.body;

    if (updateData.membershipPlan) {
      const plan = await MembershipPlan.findOne({
        _id: updateData.membershipPlan,
        gym: gymId,
      });

      if (!plan) {
        return res.status(404).json({
          message: "Membership plan not found for this gym",
        });
      }
    }

    // Normalize email if it is being updated.
    if (updateData.email !== undefined) {
      updateData.email = updateData.email?.trim().toLowerCase();
    }

    const member = await Member.findOneAndUpdate(
      {
        _id: memberId,
        gym: gymId,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("membershipPlan");

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.json({ member });
  } catch (error) {
    console.error("Update member error:", error);

    // Duplicate email within the same gym
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A member with this email already exists in this gym",
      });
    }

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findOneAndDelete({
      _id: req.params.memberId,
      gym: req.params.gymId,
    });

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.json({
      message: "Member deleted successfully",
    });
  } catch (error) {
    console.error("Delete member error:", error);

    res.status(500).json({
      message: "Server error",
    });
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
      filter.dueDate = {
        $lt: now,
      };
    } else if (status === "upcoming") {
      const threeDaysLater = new Date(now);

      threeDaysLater.setDate(
        threeDaysLater.getDate() + 3
      );

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