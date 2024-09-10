import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Route to handle user registration
router.post('/signup', async (req, res) => {
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
router.post('/login', async (req, res) => {
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
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.KEY, { expiresIn: '24h' });

        // Set the token in a cookie
        //res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Set maxAge to 1 hour

        // Set the token in an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevent access to the cookie from JavaScript
            secure: process.env.NODE_ENV === 'production', // Use secure flag in production
            maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
        });

        return res.status(200).json({ status: true, message: "Login successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: "user not registered" });
        }
        const token = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: '10m' });

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'codequest278@gmail.com',
                pass: 'lkqr utka kwub epsj'
            }
        });

        var mailOptions = {
            from: 'codequest278@gmail.com',
            to: email,
            subject: 'Reset Password',
            text: `http://localhost:5173/resetPassword/${token}`
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

router.post('/reset-password/:token', async (req, res) => {
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
router.post('/logout', (req, res) => {
    // Clear the authentication token
    res.clearCookie('token'); // If using cookies to store JWT
    return res.status(200).json({ message: 'Successfully logged out' });
});

// router.post('/logout', (req, res) => {
//     // Clear the authentication token or session
//     res.clearCookie('token'); // If using cookies to store JWT
//     req.session.destroy((err) => { // If using express-session
//         if (err) {
//             return res.status(500).json({ message: 'Failed to log out' });
//         }
//         res.status(200).json({ message: 'Successfully logged out' });
//     });
// });

const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json({ status: false, message: "no token" });
        }
        await jwt.verify(token, process.env.KEY);
        next();
    } catch (err) {
        return res.json(err);
    }
};

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ status: true });
});

router.get('/verify', verifyUser, (req, res) => {
    return res.json({ status: true, message: "authorized" });
});

// Get total problems solved
router.get('/stats/solved', verifyUser, async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you're using session or JWT
        const user = await User.findById(userId);
        const totalProblemsSolved = user.solvedProblems.length; // Assuming solvedProblems is an array
        res.json({ totalProblemsSolved });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch total problems solved' });
    }
});

// Get recent activities (last 2 solved problems)
router.get('/stats/recent', verifyUser, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const recentActivities = user.solvedProblems.slice(-2); // Get the last two problems
        res.json({ recentActivities });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch recent activities' });
    }
});

// Get user score
router.get('/stats/score', verifyUser, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const score = user.score; // Assuming the user model has a score field
        res.json({ score });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user score' });
    }
});

export { router as userRouter };
