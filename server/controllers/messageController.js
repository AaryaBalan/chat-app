const Message = require('../models/messageModel')

module.exports.addMessage = async (req, res, next) => {
    try {
        const { message, sender, reciever } = req.body
        const addedMessage = await Message.create({
            message,
            users: [sender, reciever],
            sender
        })
        res.json({ status: true, message: addedMessage })
    } catch (err) {
        next(err)
    }
}

module.exports.getAllMessage = async (req, res, next) => {
    try {
        const { sender, reciever } = req.body
        const messages = await Message.find({
            users: {
                $all: [sender, reciever],
            },
        }).sort({ createdAt: 1 })
        const formatMessage = messages.map((msg) => {
            return {
                self: msg.sender.toString() === sender,
                message: msg.message,
                time: msg.createdAt
            }
        })
        res.json(formatMessage)
    } catch (err) {
        next(err)
    }
}