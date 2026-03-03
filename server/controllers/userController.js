const User = require("../models/user");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return next(new AppError("All fields are required", 400));
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return next(new AppError("Please provide a valid email", 400));
        }

        if (password.length < 8) {
            return next(new AppError("Password must be at least 8 characters long", 400));
        }

        if (password !== confirmPassword) {
            return next(new AppError("Password and Confirm Password do not match", 400));
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new AppError("User already registered", 400));
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: encryptedPassword });

        res.status(201).json({
            status: "SUCCESS",
            message: "User registered successfully",
        })
    } catch (error) {
        next(error);
    }
}

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError("All fields are required", 400));
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return next(new AppError("Please provide a valid email", 400));
        }

        const user = await User.findOne({ email });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
                res.status(200).json({
                    status: "SUCCESS",
                    name: user.name,
                    id: user._id,
                    message: "You are Logged In Successfully",
                    jwtToken
                })
            }
            else {
                return next(new AppError("Invalid credentials", 400))
            }
        }
        else {
            return next(new AppError("Invalid credentials", 400))
        }
    } catch (error) {
        next(error);
    }
}

module.exports = { registerUser, loginUser }
