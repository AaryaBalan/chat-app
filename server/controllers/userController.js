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
                users: { $in: [userID] } // use plain string
            }
        },
        {
            $addFields: {
                reciever: {
                    $filter: {
                        input: "$users",
                        as: 'u',
                        cond: { $ne: ["$$u", userID] } // again, compare as string
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
            $project:{
                _id: "$user._id",
                username: "$user.username",
                email: "$user.email",
                isProfileImageSet: "$user.isProfileImageSet",
                profileImage: "$user.profileImage",
                active: "$user.active",
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


module.exports.getRecentUsers = async (req, res, next) => {
    try {
        const users = await module.exports.recentUsers(req.body.userId)
        res.json(users)
    } catch (err) {
        console.log(err)
    }
}