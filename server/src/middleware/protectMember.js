import jwt from "jsonwebtoken";

const protectMember = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.type !== "member") {
      return res.status(401).json({
        message: "Member authentication required",
      });
    }

    req.memberId = decoded.memberId;
    req.gymId = decoded.gymId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired member token",
    });
  }
};

export default protectMember;