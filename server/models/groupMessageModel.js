// models/groupMessageModel.js
const mongoose = require('mongoose');

const groupMessageSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GroupRoom',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GroupMessage',
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('GroupMessage', groupMessageSchema);
