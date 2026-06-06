import { config } from "dotenv";
config();

import express from "express";
import mongoose from "mongoose";
import path from 'path';
import userRoutes from './routes/user.js';
import loanRoutes from './routes/loan.js';
import cookieParser from "cookie-parser";
import cors from "cors";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port = process.env.PORT || 4000;


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.get('/', (req, res) => {
  res.json({
    message: "API is running 🚀",
  });
});

app.use(cookieParser());
    app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to MongoDB 🚀"))
.catch(err => console.log("MongoDB error:", err));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// }
// );


app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});