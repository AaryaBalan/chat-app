const Message = require('../models/messageModel')

module.exports.addMessage = async (req, res, next) => {
    try {
        const { message, sender, reciever, replyMessage } = req.body
        const addedMessage = await Message.create({
            message,
            users: [sender, reciever],
            sender,
            replyMessage
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
        })
            .populate({
                path: 'replyMessage',
                select: 'message sender createdAt',
            })
            .sort({ createdAt: 1 })
        const formatMessage = messages.map((msg) => {
            return {
                self: msg.sender.toString() === sender,
                message: msg.message,
                time: msg.createdAt,
                _id: msg._id,
                replyMessage: msg.replyMessage
                    ? {
                        _id: msg.replyMessage._id,
                        message: msg.replyMessage.message,
                        sender: msg.replyMessage.sender,
                        time: msg.replyMessage.createdAt
                    }
                    : null
            }
        })
        res.json(formatMessage)
    } catch (err) {
        next(err)
    }
}

// get message by message id
module.exports.getMessageById = async (id) => {
    try {
        const message = await Message.findById(id)
        if (message) {
            return message
        } else {
            return null
        }
    } catch (err) {
        console.log(err)
        return err
    }
}