import express from "express";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

import movieRoutes from "./routes/movieRoutes.js";

config();
connectDB();

const app = express();

app.use("/movies", movieRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on("uncaughtException", async (error) => {
  console.error("Uncaught Exception:", error);
  await disconnectDB();
  process.exit(1);
});

process.on("SIGINT", async () => {
  console.log("SIGINT signal received");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
