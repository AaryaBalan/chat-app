const mongoose = require('mongoose')
const GroupMessage = require('../models/groupMessageModel')

module.exports.addGroupMessage = async (req, res, next) => {
    try {
        const { roomId, senderId, message, replyTo } = req.body
        const groupMessage = await GroupMessage.create({
            roomId, senderId, message, replyTo: replyTo || null
        })
        await groupMessage.populate({
            path: 'senderId',
            select: 'username profileImage' // only include these fields
        });
        await groupMessage.populate({
            path: 'replyTo',
            populate: {
                path: 'senderId',
                select: 'username'
            }
        })
        res.json(groupMessage)
    } catch (err) {
        console.log(err)
    }
}

module.exports.getGroupMessageByRoomId = async (req, res, next) => {
    try {
        const { roomId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            return res.status(400).json({ error: "Invalid room ID format" });
        }

        const messages = await GroupMessage.find({ roomId })
            .sort({ createdAt: 1 })
            .populate({
                path: 'senderId',
                select: 'username profileImage' // only include these fields
            }).populate({
                path: 'replyTo',
                populate: {
                    path: 'senderId',
                    select: 'username'
                }
            })

        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}