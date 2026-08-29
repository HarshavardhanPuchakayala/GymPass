import CheckIn from "../models/CheckIn.js";
import Member from "../models/Member.js";


// POST /api/gyms/:gymId/checkins
export const checkInMember = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { memberId } = req.body;

    // 1. Validate memberId
    if (!memberId) {
      return res.status(400).json({
        message: "Member ID is required",
      });
    }

    // 2. Verify member belongs to this gym
    const member = await Member.findOne({
      _id: memberId,
      gym: gymId,
    });

    if (!member) {
      return res.status(404).json({
        message: "Member not found in this gym",
      });
    }

    // 3. Get today's start and end
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 4. Check if this member already checked in today
    const existingCheckIn = await CheckIn.findOne({
      member: memberId,
      gym: gymId,
      checkedInAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (existingCheckIn) {
      return res.status(409).json({
        message: "Member has already checked in today",
        checkIn: existingCheckIn,
      });
    }

    // 5. Create check-in
    const checkIn = await CheckIn.create({
      gym: gymId,
      member: memberId,
      checkedInBy: req.userId,
    });

    res.status(201).json({
      checkIn,
    });
  } catch (error) {
    console.error("Check-in error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// GET /api/gyms/:gymId/checkins
export const getCheckIns = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { memberId } = req.query;

    // Always scope results to this gym
    const filter = {
      gym: gymId,
    };

    // Optional member filter
    if (memberId) {
      filter.member = memberId;
    }

    const checkIns = await CheckIn.find(filter)
      .populate("member")
      .populate("checkedInBy")
      .sort({ checkedInAt: -1 });

    res.json({
      checkIns,
    });
  } catch (error) {
    console.error("Get check-ins error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};