import mongoose from "mongoose";

let connectionPromise = null;

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  try {
    mongoose.connection.once("connected", () => {
      console.log("MongoDB Connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB Error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB Disconnected");
    });

    connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      dbName: "AskVision",
      serverSelectionTimeoutMS: 5000,
    });

    await connectionPromise;
    return mongoose.connection;
  } catch (error) {
    connectionPromise = null;
    console.error("MongoDB Connection Failed:", error.message);
    throw error;
  }
};

export default connectDB;
