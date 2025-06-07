const User = require('../models/userModel');

// get all user expect the logged in user
module.exports.getAllUsersExpectMe = async (req, res, next) => {
    console.log(global.onlineUsers)
    try {
        const userId = req.params.id;
        // Find all users except the one with the given userId
        const users = await User.find({ _id: { $ne: userId } }).select("-password -__v");
        if (!users) {
            return res.json({ status: false, message: "No users found" });
        }
        return res.json({ status: true, message: "Users retrieved successfully", users });
    } catch (error) {
        next(error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
}

module.exports.setOnline = async (userId) => {
    try {
        const user = await User.findByIdAndUpdate(userId, { active: true })
        return user
    } catch (err) {
        console.log(err)
        return
    }
}

module.exports.setOffline = async (userId) => {
    try {
        const user = await User.findByIdAndUpdate(userId, { active: false })
        return user
    } catch (err) {
        console.log(err)
        return
    }
}