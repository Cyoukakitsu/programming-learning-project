import mongoose from "mongoose";

async function dbConnect() {
  const MONGODB_URL = process.env.MONGODB_URL;

  if (!MONGODB_URL) {
    throw new Error(
      "Please define the MONGODB_URL environment variable inside .env.local",
    );
  }

  try {
    const db = await mongoose.connect(MONGODB_URL);
    console.log("Connected to mongodb", db);
  } catch (error) {
    console.log("Failed to connect to mongodb:", error);
    throw error;
  }
}

export default dbConnect;
