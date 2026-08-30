import express from "express";
import "dotenv/config";
import cors from "cors";
import  {connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import gymRoutes from "./routes/gyms.js";
import staffRoutes from "./routes/staff.js";
import planRoutes from "./routes/plans.js";
import memberRoutes from "./routes/members.js";
import checkInRoutes from "./routes/checkins.js";

import "./jobs/reminderJob.js";


const Port =process.env.PORT || 3001
connectDB()

const app =express();

app.use(express.json())
app.use(cors())
app.use("/api/auth", authRoutes);
app.use("/api/gyms", gymRoutes);
app.use("/api/gyms/:gymId/plans", planRoutes);
app.use("/api/gyms/:gymId/members", memberRoutes);
app.use(
  "/api/gyms/:gymId/checkins",
  checkInRoutes
);
app.use("/api/gyms/:gymId/staff", staffRoutes);
app.listen(Port ,()=>{
    console.log("server running")
})