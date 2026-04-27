const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./Routes/authRouter");
const userRouter = require("./Routes/userRouter");
const expeRouter = require("./Routes/expeRouter");
const incoRouter = require("./Routes/incoRouter");
const budgRouter = require("./Routes/budgRouter");
const tranRouter = require("./Routes/tranRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();
const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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