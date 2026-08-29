import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb connected sucessfully")
    } catch (error){
        console.log("Mongodb connection failed", error.message);
        process.exit(1)
    }
}