import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import nodemailer from "nodemailer";
import Problem from "../models/Problem.js";

const router = express.Router();

// Middleware to verify user using JWT from cookies
const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: "Unauthorized: No token provided" });
    }
    const decoded = jwt.verify(token, process.env.KEY);
    req.user = decoded; // Attach user details from the token payload
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: false, message: "Unauthorized: Invalid token" });
  }
};

const updateUserStats = async (userId, problemId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const problem = await Problem.findById(problemId);

    if (!problem) throw new Error("Problem not found");

    // Check if problem is already solved
    if (user.solvedProblems.includes(problemId)) {
      return;
    }

    // Update solvedProblems
    user.solvedProblems.push(problemId);
    user.solvedAt.push(Date.now()); // Assuming you have a 'solvedAt' array

    // Update score based on difficulty
    let scoreIncrement = 0;
    switch (problem.difficulty.toLowerCase()) {
      case "easy":
        scoreIncrement = 20;
        break;
      case "medium":
        scoreIncrement = 50;
        break;
      case "hard":
        scoreIncrement = 80;
        break;
      default:
        scoreIncrement = 0;
    }
    user.score = (user.score || 0) + scoreIncrement;

    await user.save();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// Route to fetch solved problems for the current user
router.get("/solved", verifyUser, async (req, res) => {
    console.log("Solved problems")
  try {
    const userId = req.user.id; // Use JWT decoded user ID

    // Fetch user's solved problems
    const user = await User.findById(userId).populate(
      "solvedProblems",
      "title"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the solved problems
    res.json(user.solvedProblems);
  } catch (error) {
    console.error("Error fetching solved problems:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to handle user registration
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashpassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashpassword,
    });

    // Save the new user to the database
    await newUser.save();

    return res.status(201).json({ status: true, message: "Record registered" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Route to handle user login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User is not registered" });
    }

    // Verify the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    // Create a JWT token
    //const token = jwt.sign({ username: user.username }, process.env.KEY, { expiresIn: '24h' });
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.KEY,
      { expiresIn: "24h" }
    );

    // Set the token in a cookie
    //res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Set maxAge to 1 hour

    // Set the token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent access to the cookie from JavaScript
      secure:false,
     // secure: process.env.NODE_ENV === "production", // Use secure flag in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    });

    return res
      .status(200)
      .json({ status: true, message: "Login successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "user not registered" });
    }
    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "10m",
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "codequest278@gmail.com",
        pass: "lkqr utka kwub epsj",
      },
    });

    var mailOptions = {
      from: "codequest278@gmail.com",
      to: email,
      subject: "Reset Password",
      text: `http://localhost:5173/resetPassword/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({ message: "error sending email" });
      } else {
        return res.json({ status: true, message: "email sent" });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params; // Correct extraction of token
  const { password } = req.body;
  try {
    const decoded = await jwt.verify(token, process.env.KEY);
    const id = decoded.id;
    const hashpassword = await bcrypt.hash(password, 10); // Await bcrypt.hash
    await User.findByIdAndUpdate(id, { password: hashpassword }); // Directly use id
    return res.json({ status: true, message: "updated password" });
  } catch (err) {
    return res.json({ message: "invalid token" });
  }
});

// Logout route

// Updated Logout Route
router.post("/logout", (req, res) => {
  // Clear the authentication token
  res.clearCookie("token"); // If using cookies to store JWT
  return res.status(200).json({ message: "Successfully logged out" });
});

// const verifyUser = async (req, res, next) => {
//     try {
//         const token = req.cookies.token;
//         if (!token) {
//             return res.json({ status: false, message: "no token" });
//         }
//         await jwt.verify(token, process.env.KEY);
//         next();
//     } catch (err) {
//         return res.json(err);
//     }
// };

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ status: true });
});

router.get("/verify", verifyUser, (req, res) => {
  return res.json({ status: true, message: "authorized" });
});

// Fetch total problems solved by the user
router.get("/stats/solved", verifyUser, async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from JWT
    const user = await User.findById(userId).populate("solvedProblems"); // Populate if needed
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const totalProblemsSolved = user.solvedProblems.length;
    res.json({ totalProblemsSolved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch total problems solved" });
  }
});

// Fetch recent activities (last two solved problems)
router.get("/stats/recent", verifyUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate({
      path: "solvedProblems",
      options: { sort: { solvedAt: -1 }, limit: 2 }, // Assuming you have a 'solvedAt' field
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const recentActivities = user.solvedProblems.map(
      (problem) => problem.title
    ); // Adjust as per your Problem model
    res.json({ recentActivities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recent activities" });
  }
});

// Fetch user score
router.get("/stats/score", verifyUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const score = user.score || 0; // Default to 0 if not set
    res.json({ score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user score" });
  }
});
export { router as userRouter, updateUserStats };
