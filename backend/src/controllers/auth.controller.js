import { generateToken } from '../lib/utils.js';
import User from '../models/user.models.js';
import bcrypt from 'bcryptjs';

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

export const login = async (req, res) => {

    const { email, password } = req.body;
    try {
        const user = User.findOne({ email });

        if (!user) {
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
}

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
