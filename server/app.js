


import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import categoryRoutes from "./routes/category.route.js";
import eventRoutes from "./routes/event.route.js";
import announcementRoutes from "./routes/announcement.route.js";
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import reviewRoutes from "./routes/review.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
import notificationRoutes from "./routes/notification.route.js";
import orderRoute from "./routes/order.route.js";
import brandRoute from "./routes/brand.route.js";
import statsRoute from "./routes/stats.route.js";
import bannerRoute from "./routes/banner.route.js";

import { app, server } from "./lib/socket.js";
import { connect } from './lib/db.js';

dotenv.config();

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: [process.env.CLIENT_URL,process.env.DASHBOARD_URL],
    credentials: true,
  })
);

mongoose.set("strictQuery", true);

app.use("/api/auth", authRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/conversation", conversationRoute);
app.use("/api/message", messageRoute);
app.use("/api/orders", orderRoute);
app.use("/api/brand", brandRoute);
app.use("/api/stats", statsRoute);
app.use("/api/banner", bannerRoute);



app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});


server.listen(3002, () => {
  connect();
  console.log("Backend server is running!");
});
