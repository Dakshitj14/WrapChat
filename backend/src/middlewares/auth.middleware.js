import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

export const protectRoute = async (req, res, next) => {
    try {
        // Get token from cookie or Authorization header
        const token = req.cookies.jwt || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized: Invalid user" });
        }

        // Fetch user from DB
        const user = await User.findById(decoded.id || decoded._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
