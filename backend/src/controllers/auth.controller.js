import User from '../models/user.models.js';
import bcrypt from 'bcryptjs';
export const signup = (req, res) => {
    const { fullName, email, password } = req.body;
    try{
        if(password.length < 8){
            res.status(400).send("Password should be at least 8 characters long");
        }
        const user =await User.findOne({email});
        if(user){
            res.status(400).send("Email already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if(newUser){
            // will be generating jwt token here 
            await newUser.save();
            res.send("User created successfully");
        } else{
            res.status(400).send("Invalid user data"); 
        }

    }
};
export const login = (req, res) => {
    res.send("login controller");
};
export const logout = (req, res) => {
    res.send("logout controller");
};