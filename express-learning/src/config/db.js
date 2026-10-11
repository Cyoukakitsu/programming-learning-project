import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};

const disconnectDB = async () => {
  await prisma.$disconnect();
};

export default { prisma, connectDB, disconnectDB };
