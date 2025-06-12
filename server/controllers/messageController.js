const { default: mongoose } = require('mongoose')
const Message = require('../models/messageModel')

// add a new message to the db
module.exports.addMessage = async (req, res, next) => {
    try {
        const { message, sender, reciever, replyMessage } = req.body
        const addedMessage = await Message.create({
            message,
            users: [sender, reciever],
            sender,
            replyMessage
        })
        await module.exports.setSeen(sender, reciever)
        res.json({ status: true, message: addedMessage })
    } catch (err) {
        next(err)
    }
}

// get all message between the 2 peoples
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

// unseen msg by user
module.exports.getUnseenMessages = async (userId) => {
    const rawMessages = await Message.aggregate([
        {
            $match: {
                users: { $in: [userId] },
                seen: false,
                sender: { $ne: new mongoose.Types.ObjectId(userId) }
            }
        },
        {
            $group: {
                _id: "$sender",   
                count: { $sum: 1 }
            }
        }
    ]);
    const result = {};
    rawMessages.forEach(msg => {
        result[msg._id.toString()] = msg.count;
    });

    return result;
};

// unseen route
module.exports.getUnseenMessagesRoute = async (req, res, next) => {
    try {
        const { userId } = req.body
        const unseenMessage = await module.exports.getUnseenMessages(userId)
        res.json(unseenMessage)
    } catch (err) {
        console.log(err)
    }
}

// set message as seen to the user
module.exports.setSeen = async (userId, chatPersonId) => {
    try {
        const messages = await Message.updateMany({
            users: {
                $all: [userId, chatPersonId]
            },
            sender: new mongoose.Types.ObjectId(chatPersonId),
            seen: false
        }, {
            $set: { seen: true }
        })
        return messages
    } catch (err) {
        return err
    }
}

// delete unseen notification and set as all seen
module.exports.setAllSeenRoute = async (req, res, next) => {
    try {
        console.log(req.body)
        const { userId, chatPersonId } = req.body
        const messages = await module.exports.setSeen(userId, chatPersonId)
        res.json(messages)
    } catch (err) {
        console.log(err)
    }
}