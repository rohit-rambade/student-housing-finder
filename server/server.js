import express from "express";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import cookieParser from "cookie-parser";
import cors from "cors";
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
import { connectDB } from "./config/database.js";
import userRoutes from "./routes/user.routes.js";
import landlordRoutes from "./routes/landlord.routes.js";
import studentRoutes from "./routes/student.routes.js";
connectDB(); //database connection

app.use("/api/users", userRoutes);
app.use("/api/landlord", landlordRoutes);
app.use("/api/student", studentRoutes);
app.listen(PORT, () => {
  console.log(`Server Started On Port ${PORT}`);
});
