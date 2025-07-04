const mongoos = require('mongoose')
const User = require('../models/userModel');
const Message = require('../models/messageModel')

// get all user expect the logged in user
module.exports.getAllUsersExpectMe = async (req, res, next) => {
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

// setting active status for the user
module.exports.setOnline = async (userId) => {
    try {
        const user = await User.findByIdAndUpdate(userId, { active: true })
        return user
    } catch (err) {
        console.log(err)
        return
    }
}

// setting active status off for the user
module.exports.setOffline = async (userId) => {
    try {
        const user = await User.findByIdAndUpdate(userId, { active: false })
        return user
    } catch (err) {
        console.log(err)
        return
    }
}

// get user by id
module.exports.getUserById = async (userId) => {
    try {
        const user = await User.findById(userId)
        return user
    } catch (err) {
        console.log(err)
    }
}

// recent users based on messages
module.exports.recentUsers = async (userID) => {
    const users = await Message.aggregate([
        {
            $match: {
                users: { $in: [userID] } 
            }
        },
        {
            $addFields: {
                reciever: {
                    $filter: {
                        input: "$users",
                        as: 'u',
                        cond: { $ne: ["$$u", userID] } 
                    }
                }
            }
        },
        { $unwind: "$reciever" },
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: "$reciever",
                lastMessage: { $first: "$message" },
                lastDate: { $first: "$createdAt" }
            }
        },
        {
            $addFields: {
                userObjectId: { $toObjectId: "$_id" }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userObjectId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                _id: "$user._id",
                username: "$user.username",
                email: "$user.email",
                isProfileImageSet: "$user.isProfileImageSet",
                profileImage: "$user.profileImage",
                active: "$user.active",
                firstName: "$user.firstName",
                lastName: "$user.lastName",
                bio: "$user.bio",
                dob: "$user.dob",
                github: "$user.github",
                linkedin: "$user.linkedin",
                lastMessage: 1,
                lastDate: 1
            }
        },
        {
            $sort: { lastDate: -1 }
        }
    ])
    return users
}

// get recent users
module.exports.getRecentUsers = async (req, res, next) => {
    try {
        const users = await module.exports.recentUsers(req.body.userId)
        res.json(users)
    } catch (err) {
        console.log(err)
    }
}

// update the user by id
module.exports.updateUserById = async (userId, data) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            data,
            { new: true, runValidators: true }
        );
        return updatedUser;
    } catch (err) {
        console.log(err)
    }
};

// Update route handler
module.exports.updateUserByIdRoute = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const userData = req.body;

        // Validate userData if needed before update
        const updatedUser = await module.exports.updateUserById(userId, userData);
        if (updatedUser) {
            res.json({ status: true, updatedUser });
        } else {
            res.json({ status: false, message: 'No User found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};
