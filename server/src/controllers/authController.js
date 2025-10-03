import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';


const registerUser = asyncHandler(async (req, res) => {
    const { username , email, password } = req.body;
    const userExists = await User.findOne ({email});
    if (userExists) {
        res.status(400); // Bad request
        throw new Error ('User already exists with this email');
    }
    const user = await User.create({
        username, email, password,
    });
    if (user){
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            message: 'Registration successful!',
        });
    } else {
        res.status(400)
        throw new Error('Invalid user data');
        
    }
});


const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    }else{
        res.status(401); // Unauthorized
        throw new Error ('Invalid email or password');
    }
});
export {registerUser, authUser};