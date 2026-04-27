const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./Routes/authRouter");
const userRouter = require("./Routes/userRouter");
const expeRouter = require("./Routes/expeRouter");
const incoRouter = require("./Routes/incoRouter");
const budgRouter = require("./Routes/budgRouter");
const tranRouter = require("./Routes/tranRoutes");
require("dotenv").config();

const app = express();
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:3000",
  "https://finance-tracker-frontend-cyan.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// 🔥 VERY IMPORTANT (preflight fix)
app.options("*", cors());

app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.log("DB Error:", err);
    process.exit(1);
  });

// routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/expense", expeRouter);
app.use("/income", incoRouter);
app.use("/budget", budgRouter);
app.use("/transactions", tranRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
