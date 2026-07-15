import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";

import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import paymentrouter from "./routes/paymentRoutes.js";

const app = express();

const splitOrigins = (value) =>
  value
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

const allowedOrigins = [
  ...splitOrigins(process.env.ALLOWED_ORIGINS),
  ...splitOrigins(process.env.CLIENT_URL),
];

if (allowedOrigins.length === 0) {
  allowedOrigins.push("http://localhost:5173");
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));

app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/payments", paymentrouter);

app.get("/", (req, res) => {
  res.send("AskVision API is live");
});

app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});

export default app;
