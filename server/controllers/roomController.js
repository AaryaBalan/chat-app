const mongoose = require('mongoose'); // no destructuring here
const Room = require('../models/roomModel');
const GroupMessage = require('../models/groupMessageModel')

// Create a room
module.exports.createRoom = async (req, res, next) => {
    try {
        console.log(req.body);
        const { roomName, roomDescription, admin, svgId, type } = req.body;

        const findRoom = await Room.findOne({ name: roomName });
        if (findRoom) {
            return res.json({ status: false, message: "Room name already taken!" });
        }

        const room = await Room.create({
            name: roomName,
            description: roomDescription,
            admin: new mongoose.Types.ObjectId(admin), // ✅ Correct usage
            membersList: [new mongoose.Types.ObjectId(admin)],
            avatar: { svgId, type }
        });

        console.log("Room created:", room);
        res.json({ status: true, room });
    } catch (err) {
        console.error("Create room error:", err);
        res.json({ status: false, message: err.message });
    }
};

module.exports.getRooms = async (req, res, next) => {
    try {
        const rooms = await Room.find({}).sort({ createdAt: -1 })
        res.json(rooms)
    } catch (err) {
        console.log(err)
    }
}

// get particular room by id
module.exports.getRoomById = async (req, res, next) => {
    try {
        const { roomId } = req.params
        const room = await Room.findById(roomId)
        res.json(room)
    } catch (err) {
        console.log(err)
    }
}

// Join a room
module.exports.joinRoom = async (req, res, next) => {
    try {
        const { userId, roomId } = req.body;

        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Find the room first
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ status: false, message: 'Room not found' });
        }

        // Only add user if not already in the list
        const alreadyJoined = room.membersList.some(member => member.equals(userObjectId));
        if (alreadyJoined) {
            return res.status(200).json({ status: false, message: 'User already in the room', room });
        }

        // Update room
        room.membersList.push(userObjectId);
        room.membersCount += 1;
        const updatedRoom = await room.save();

        res.status(200).json(updatedRoom);
    } catch (err) {
        console.error('Error joining room:', err);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};


const getRecentRoomsByUserId = async (userId) => {
    const id = new mongoose.Types.ObjectId(userId)
    const latestMessageRooms = await Room.aggregate([
        // Step 1: Filter rooms where user is a member
        {
            $match: {
                membersList: id
            }
        },

        // Step 2: Lookup latest message from GroupMessage collection
        {
            $lookup: {
                from: "groupmessages", // collection name for GroupMessage
                let: { roomId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$roomId", "$$roomId"] } } },
                    { $sort: { createdAt: -1 } },
                    { $limit: 1 }
                ],
                as: "latestMessage"
            }
        },

        // Step 3: Flatten latestMessage array
        {
            $unwind: {
                path: "$latestMessage",
                preserveNullAndEmptyArrays: true
            }
        },

        // Step 4: Optional — Lookup sender details
        {
            $lookup: {
                from: "users",
                localField: "latestMessage.senderId",
                foreignField: "_id",
                as: "sender"
            }
        },
        {
            $unwind: {
                path: "$sender",
                preserveNullAndEmptyArrays: true
            }
        },

        // Step 5: Project only required fields
        {
            $project: {
                _id: 1,
                name: 1,
                avatar: 1,
                description: 1,
                latestMessage: "$latestMessage.message",
                messageTime: "$latestMessage.createdAt",
                sender: {
                    _id: "$sender._id",
                    name: "$sender.name"
                }
            }
        },

        // Step 6: Sort rooms based on latest message timestamp
        {
            $sort: { messageTime: -1 }
        }
    ]);
    return latestMessageRooms
}

module.exports.getRecentRoomsByUserIdRoute = async (req, res, next) => {
    try {
        const rooms = await getRecentRoomsByUserId(req.body.userId)
        res.json(rooms)
    } catch (err) {
        console.log(err)
    }
}