
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();




router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Please enter a valid email"
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters"
        });
    }

    const existingUser = await User.findOne({ email });

if (existingUser) {
    return res.status(409).json({
        message: "Email is already registered"
    });
}

const hashedPassword = await bcrypt.hash(password, 10);

const user = await User.create({
    name,
    email,
    password: hashedPassword
});

res.status(201).json({
    message: "User registered successfully"
});
});

module.exports = router;