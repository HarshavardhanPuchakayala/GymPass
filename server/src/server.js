import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import  {connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import gymRoutes from "./routes/gyms.js";
dotenv.config()

const Port =process.env.PORT || 3001
connectDB()

const app =express();

app.use(express.json())
app.use(cors())
app.use("/api/auth", authRoutes);
app.use("/api/gyms", gymRoutes);
app.listen(Port ,()=>{
    console.log("server running")
})