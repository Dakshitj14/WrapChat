import { generateToken } from '../lib/utils.js';
import User from '../models/user.models.js';
import bcrypt from 'bcryptjs';
import multer from "multer";
import dotenv from 'dotenv';
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

// ✅ Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer Configuration (for Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

export { upload };

// ✅ Signup
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
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
            profilePic: newUser.profilePic || "", // Ensure profilePic field is handled
        });

    } catch (error) {
        console.error("Error in signup controller", error);
        if (!res.headersSent) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

// ✅ Login
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
            profilePic: user.profilePic || "",
        });

    } catch (error) {
        console.error("Error in login controller", error);
        if (!res.headersSent) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

// ✅ Logout
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

// ✅ Update Profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.id; // Ensure authentication middleware sets `req.user`
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // ✅ Upload image buffer to Cloudinary
        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "profile_pics" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        const uploadResult = await uploadPromise;
        if (!uploadResult.secure_url) {
            return res.status(500).json({ message: "Image upload failed" });
        }

        const profilePicUrl = uploadResult.secure_url;

        // ✅ Update user profile in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: profilePicUrl }, // Ensure correct field name
            { new: true }
        );

        res.json({ 
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            profilePic: updatedUser.profilePic, // Ensure frontend gets the correct field
            createdAt: updatedUser.createdAt 
        });
    } catch (error) {
        console.error("Error in updateProfile controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// ✅ Check Auth
export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error in checkAuth controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
