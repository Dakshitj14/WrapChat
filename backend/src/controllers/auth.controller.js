import { generateToken } from '../lib/utils.js';
import User from '../models/user.models.js';
import bcrypt from 'bcryptjs';
import multer from "multer";
import dotenv from 'dotenv';
import { v2 as cloudinary } from "cloudinary"; //
// 
//  ✅ FIX: Import Cloudinary

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

dotenv.config();
// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Fix: Export `upload` to use in routes
export { upload };

// Signup
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).send("Please provide all the required fields");
        }
        if (password.length < 8) {
            return res.status(400).send("Password should be at least 8 characters long");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ fullName, email, password: hashedPassword });

        await newUser.save();

        generateToken(newUser._id, res);

        return res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profileImage: newUser.profileImage,
        });

    } catch (error) {
        console.error("Error in signup controller", error);
        if (!res.headersSent) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

// Login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !password || !user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profileImage: user.profileImage,
        });

    } catch (error) {
        console.error("Error in login controller", error);
        if (!res.headersSent) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

// Logout
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout controller", error);
        if (!res.headersSent) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

// Update profile

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from token

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pics",
    });

    // Get Cloudinary image URL
    const profilePicUrl = uploadResult.secure_url;

    // Update user profile in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: profilePicUrl }, // Save new image URL
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error("Error in updateProfile controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// Check Auth
export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
