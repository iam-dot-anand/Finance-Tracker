const express = require('express');
const connectMongoDB = require('./config/db');
const authRouter = require('./Routes/authRouter');
const userRouter = require('./Routes/userRouter');
const expeRouter = require('./Routes/expeRouter');
const incoRouter = require('./Routes/incoRouter');
const budgRouter = require('./Routes/budgRouter');
const tranRouter = require('./Routes/tranRoutes');
require('dotenv').config();
const app = express();
const PORT = 8000;
const cors = require('cors');

app.use(cors());
// middleware
app.use(express.json());    

// DB connect
connectMongoDB();

// routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/expense', expeRouter);
app.use('/income', incoRouter);
app.use('/budget', budgRouter);
app.use('/transactions', tranRouter);

app.listen(PORT, () => console.log("Server Started!"));