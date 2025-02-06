import jwt from 'jsonwebtoken';
export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.cookie('token', token, {
        maxAge: process.env.JWT_EXPIRES_IN * 1000,
        httpOnly: true,
    });
}