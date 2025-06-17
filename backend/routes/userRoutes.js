const express = require('express');
const User = require('../models/UserModel');
const userRouter = express.Router();
const jwt = require('jsonwebtoken');

// Register route
userRouter.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new User
        const user = await User.create({ username, email, password });
        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login route
userRouter.post('/login', async (req, res) => {
    try {
        console.log("Login route hit")
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user) // Pass the user object to generateToken
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Generate token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin // Include isAdmin from the user object
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d",
        }
    );
};

module.exports = userRouter;
