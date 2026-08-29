import cron from "node-cron";
import Member from "../models/Member.js";
import Gym from "../models/Gym.js";

cron.schedule("*/1 * * * *", async () => {
  try {
    console.log("Running reminder check...");

    const now = new Date();

    const threeDaysLater = new Date(now);
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const members = await Member.find({
      dueDate: {
        $lte: threeDaysLater,
      },
    }).populate("gym");

    for (const member of members) {
      console.log(
        `Would remind: ${member.name}, Gym: ${member.gym?.name}, due: ${member.dueDate}`
      );
    }
  } catch (error) {
    console.error("Reminder job error:", error);
  }
});

console.log("Reminder job started");