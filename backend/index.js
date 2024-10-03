import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from "morgan"
import cookieParser from 'cookie-parser';
import { userRouter } from './routes/user.js';
import problemsRouter from './routes/problems.js'; // Import the problems router
import execution from "./routes/execution.js";

dotenv.config();
console.log(process.env);


const app = express();

// Debug environment variables
// console.log("MongoDB URL:", process.env.MONGO_URL);
console.log("MongoDB URL:", process.env.MONGO_URL);
console.log("Server Port:", process.env.PORT);

app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
    origin:["https://code-quest-eight.vercel.app/","http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://code-quest-eight.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});


app.options('*', cors());
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use('/auth', userRouter);
app.use('/api/problems', problemsRouter); // Add the problems route
app.use(execution);
app.get('/test', (req, res) => {
  res.send('Test route is working');
});


// Database connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Database Connected'))
.catch((err) => console.log('Database not connected', err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server is Running on port ${PORT}`);
});




