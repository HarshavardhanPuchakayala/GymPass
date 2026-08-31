import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Member from "../models/Member.js";

export const memberLogin = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const member = await Member.findOne({
      gym: gymId,
      email: normalizedEmail,
    });

    if (!member || !member.password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      member.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        memberId: member._id.toString(),
        gymId: member.gym.toString(),
        type: "member",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        gym: member.gym,
        membershipPlan: member.membershipPlan,
        dueDate: member.dueDate,
      },
    });
  } catch (error) {
    console.error("Member login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};