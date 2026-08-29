import mongoose from "mongoose";

const staffMembershipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "staff"],
      required: true,
      default: "staff",
    },
  },
  {
    timestamps: true,
  }
);

staffMembershipSchema.index({ user: 1, gym: 1 }, { unique: true });

const StaffMembership = mongoose.model(
  "StaffMembership",
  staffMembershipSchema
);

export default StaffMembership;