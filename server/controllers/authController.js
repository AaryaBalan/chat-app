const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Register a new user
module.exports.registerUser = async (req, res, next) => {

    try {
        // Check if user already exists
        const { username, email, password } = req.body;
        const checkUsername = await User.findOne({ username });
        if (checkUsername) {
            return res.json({ status: false, message: "Username already exists" });
        }
        const checkEmail = await User.findOne({ email });
        if (checkEmail) {
            return res.json({ status: false, message: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });
        return res.json({ status: true, message: "User registered successfully", user: newUser });
    } catch (error) {
        next(error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
}

// login a user
module.exports.loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.json({ status: false, message: "Username does not exist" });
        }
        const isPasseordValid = await bcrypt.compare(password, user.password);
        if (!isPasseordValid) {
            return res.json({ status: false, message: "Wrong password" });
        }
        return res.json({ status: true, message: "Login successful", user });
    } catch (error) {
        next(error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
}

// setting up the profile image of the user
module.exports.setProfileImage = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const profileImage = req.body.profileImage;
        const user = await User.findByIdAndUpdate(userId, {
            isProfileImageSet: true,
            profileImage
        });
        if (!user) {
            return res.json({ status: false, message: "User not found" });
        }
        return res.json({ status: true, message: "Profile image set successfully", user });
    } catch (error) {
        next(error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
}