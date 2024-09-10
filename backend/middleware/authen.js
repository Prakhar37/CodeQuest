// import jwt from "jsonwebtoken";
// import {User} from "../models/User.js";

// // Middleware to check if the user is authenticated
// export const authenticate = (req, res, next) => {
//     const token = req.header("Authorization")?.replace("Bearer ", "");
//     if (!token) {
//         return res.status(401).send({ error: "Please authenticate." });
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.KEY);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         res.status(401).send({ error: "Invalid token, please authenticate again." });
//     }
// };

// import jwt from 'jsonwebtoken';
// import {User} from '../models/User.js';

// export const authenticate = async (req, res, next) => {
//     const token = req.headers['authorization']?.split(' ')[1]; // Extract token

//     if (!token) {
//         return res.status(401).json({ success: false, error: 'No token provided' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.KEY); // Verify token
//         req.user = await User.findById(decoded.id); // Fetch user based on token
//         if (!req.user) {
//             return res.status(401).json({ success: false, error: 'Invalid token' });
//         }
//         next(); // Proceed to next middleware/route handler
//     } catch (err) {
//         res.status(401).json({ success: false, error: 'Invalid token' });
//     }
// };


// export default authenticate;

// // Middleware to check if the user is an admin
// export const authorizeAdmin = async (req, res, next) => {
//     try {
//         const user = await User.findById(req.user.id);
//         if (!user || user.role !== "admin") {
//             return res.status(403).send({ error: "Access denied." });
//         }
//         next();
//     } catch (err) {
//         res.status(500).send({ error: "Internal server error." });
//     }
// };




// import jwt from 'jsonwebtoken';
// import { User } from '../models/User.js';

// export const authenticate = async (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     if (!authHeader) {
//         return res.status(401).json({ success: false, error: 'No authorization header' });
//     }

//     const token = authHeader.split(' ')[1]; // Extract token from header
//     if (!token) {
//         return res.status(401).json({ success: false, error: 'No token provided' });
//     }


//     try {
//         const decoded = jwt.verify(token, process.env.KEY); // Verify token
//         console.log('Decoded token:', decoded); // Debug token decoding
//         req.user = await User.findById(decoded.id); // Fetch user based on token
//         if (!req.user) {
//             return res.status(401).json({ success: false, error: 'User not found' });
//         }
//         next(); // Proceed to next middleware/route handler
//     } catch (err) {
//         console.error('Token verification error:', err); // Debug error
//         res.status(401).json({ success: false, error: 'Invalid token' });
//     }
// };

// export default authenticate;





import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const authenticate = async (req, res, next) => {
    // Get the token from cookies
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.KEY);
        
        // Find the user based on the token
        req.user = await User.findById(decoded.id).select('-password'); // Exclude the password
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        next(); // Move to the next middleware or route handler
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

export default authenticate;
