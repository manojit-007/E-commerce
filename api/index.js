// 🔹 Import Dependencies
import express, { urlencoded } from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import UserRouter from "./routes/userRouter.js";
import ProductRouter from "./routes/productRoute.js";
import ImageRouter from "./routes/imageRoute.js";
import OrderRoute from "./routes/orderRoute.js";
import responseHandler from "./utils/responseHandler.js";
import PaymentRouter from "./routes/paymentRoute.js";

// 🔹 Load Environment Variables
dotenv.config();

// 🔹 Initialize Express and Socket.io
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN ,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Authorization",
    ],
  },
});

// 🔹 Middleware Configuration
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.ORIGIN ,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Authorization",
    ],
  })
);

// 🔹 MongoDB Connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
}
connectDB();

// 🔹 Socket.io Connection
io.on("connection", (socket) => {
  console.log("🔗✅ New client connected");
  socket.on("disconnect", () => console.log("❌ Client disconnected"));
});

// 🔹 Pass `io` to Routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// 🔹 Register Routers
app.use("/image", ImageRouter);
app.use("/payment", PaymentRouter);
app.use("/user", UserRouter);
app.use("/product", ProductRouter(io));
app.use("/order", OrderRoute(io));

// 🔹 Serve Frontend (for Production)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// 🔹 Root and Fallback Routes
app.all("/", (req, res) =>
  res.status(200).json({ message: "Welcome! API server is up and running." })
);
app.all("*", (req, res) =>
  res.status(404).json({ message: "❌ Route not found." })
);

// 🔹 Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.message || err);
  responseHandler(
    res,
    err.status || 500,
    err.message || "Internal Server Error"
  );
});

// 🔹 Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// 🔹 Graceful Shutdown
const shutdown = async () => {
  console.log("🛑 Shutting down...");
  await mongoose.connection.close();
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
