import mongoose from "mongoose";
import Member from "../models/Member.js";
import MembershipPlan from "../models/MembershipPlan.js";
import Payment from "../models/Payment.js";

export const recordPayment = async (req, res) => {
  try {
    const { gymId, memberId } = req.params;

    // Find member inside this gym
    const member = await Member.findOne({
      _id: memberId,
      gym: gymId,
    });

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    // Find member's plan inside the same gym
    const plan = await MembershipPlan.findOne({
      _id: member.membershipPlan,
      gym: gymId,
    });

    if (!plan) {
      return res.status(404).json({
        message: "Membership plan not found",
      });
    }

    // Calculate new due date
    const previousDueDate = new Date(member.dueDate);

    const candidateDueDate = new Date(previousDueDate);

    candidateDueDate.setDate(
      candidateDueDate.getDate() + plan.duration
    );

    const today = new Date();

    const newDueDate =
      candidateDueDate > today ? candidateDueDate : today;

    // Start transaction
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // Create payment
      const [payment] = await Payment.create(
        [
          {
            gym: gymId,
            member: memberId,
            amount: plan.price,
            previousDueDate,
            newDueDate,
            recordedBy: req.userId,
          },
        ],
        { session }
      );

      // Update member's due date
      member.dueDate = newDueDate;

      await member.save({ session });

      // Commit both operations
      await session.commitTransaction();

      res.status(201).json({
        payment,
        member,
      });
    } catch (error) {
      // Roll back both operations if anything fails
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Record payment error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


export const getPayments = async (req, res) => {
  try {
    const { gymId, memberId } = req.params;

    const payments = await Payment.find({
      gym: gymId,
      member: memberId,
    })
      .populate("recordedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ payments });
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};