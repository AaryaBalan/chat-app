const mongoose = require('mongoose'); // no destructuring here
const Room = require('../models/roomModel');

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
        res.status(500).json({ status: false, message: err.message });
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
