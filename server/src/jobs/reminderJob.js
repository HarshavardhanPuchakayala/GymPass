import cron from "node-cron";
import Member from "../models/Member.js";
import StaffMembership from "../models/staffMembership.js";
import User from "../models/User.js";
import { sendReminderEmail } from "../utils/sendReminderEmail.js";

cron.schedule("*/1 * * * *", async () => {
  try {
   

    const now = new Date();
    const threeDaysLater = new Date(now);
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const members = await Member.find({
      dueDate: { $lte: threeDaysLater },
    }).populate("gym");

    // Group members by gym ID
    const membersByGym = {};
    for (const member of members) {
      if (!member.gym) continue; // defensive: skip orphaned members
      const gymId = member.gym._id.toString();
      if (!membersByGym[gymId]) {
        membersByGym[gymId] = { gym: member.gym, members: [] };
      }
      membersByGym[gymId].members.push(member);
    }

    // For each gym, find the owner and send one summary email
    for (const gymId of Object.keys(membersByGym)) {
      const { gym, members: gymMembers } = membersByGym[gymId];

      const ownerMembership = await StaffMembership.findOne({
        gym: gymId,
        role: "owner",
      });

      if (!ownerMembership) {
        console.log(`No owner found for gym ${gym.name}, skipping`);
        continue;
      }

      const owner = await User.findById(ownerMembership.user);
      if (!owner) continue;

      await sendReminderEmail({
        to: owner.email,
        gymName: gym.name,
        members: gymMembers,
      });

      console.log(`Reminder email sent to ${owner.email} for gym ${gym.name}`);
    }
  } catch (error) {
    console.error("Reminder job error:", error);
  }
});

