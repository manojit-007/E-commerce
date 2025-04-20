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
// import Stripe from "stripe";
import PaymentRouter from "./routes/paymentRoute.js";

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN,
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {});

// Middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// MongoDB Connection
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

// Handle socket connections
io.on("connection", (socket) => {
  console.log("🔗✅ New client connected");
  socket.on("disconnect", () => console.log("❌ Client disconnected"));
});

// Pass `io` to product routes
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use((err, req, res, next) => {
  console.log(err);
  responseHandler(res, err?.status || 500, err.message || "Internal Server Error");
});


app.use("/image", ImageRouter);
app.use("/payment", PaymentRouter);
app.use("/user", UserRouter);
app.use("/product", ProductRouter(io)); // Pass `io` here
app.use("/order", OrderRoute(io)); 

// Serve frontend files (for production deployment)
app.use(express.static(path.join(__dirname, "public")));

// Handle unhandled routes
app.all("/", (req, res) =>
  res.status(200).json({ message: "Welcome! API server is up and running." })
);
app.all("*", (req, res) =>
  res.status(404).json({ message: "❌ Route not found." })
);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Graceful Shutdown
const shutdown = async () => {
  console.log("🛑 Shutting down...");
  await mongoose.connection.close();
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
