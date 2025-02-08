import { generateToken } from '../lib/utils.js';
import User from '../models/user.models.js';
import bcrypt from 'bcryptjs';

// signup
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if(!fullName || !email || !password) {
            return res.status(400).send("Please provide all the required fields");
        }
        // Check if password length is valid
        if (password.length < 8) {
            return res.status(400).send("Password should be at least 8 characters long");
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email already exists");
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        // Save user to database
        await newUser.save();

        // Generate JWT token
        generateToken(newUser._id, res);

        // Send success response
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
// login
export const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Fix: Add await to User.findOne
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Fix: Ensure password exists before comparing
        if (!password || !user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        generateToken(user._id, res);

        // Send success response
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
// logout
export const logout = (req, res) => {
    try{
        res.cookie("jwt", "", {maxAge:0});
        return res.status(200).json({message:"Logged out successfully"});
    }catch(error){
        console.error("Error in logout controller", error);
        
        if (!res.headersSent) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};
// update profile
export const updateProfile = async (req, res) => {
    try {
        const {profileImage} = req.body;
        const userId =req.user._id;
        if(!profileImage){
            return res.status(400).json({message:"Profile image is required"});
        
        }
        const uploadResponse =await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId,{profileImage:uploadResponse.secure_url}, {new:true});
        return res.status(200).json(updatedUser);


    }catch(error){
        console.error("Error in updateProfile controller", error);
        res.status(500).json({message:"Internal server error"});

    }

};
// checkAuth
export const checkAuth = (req, res) => {
    try{

        res.status(200).json(req.user);

    }catch(error){
        console.log("Error in checkAuth controller", error);
        res.status(500).json({message:"Internal server error"});

    }
}
