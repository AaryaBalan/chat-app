const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
    },
    description: {
        type: String,
        minlength: 5,
        maxlength: 500,
        default: '',
        trim: true,
    },
    membersCount: {
        type: Number,
        default: 1,
        min: 1,
    },
    membersList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    avatar: {
        svgId: {
            type: String,
            required: true,
            default: 'default'
        },
        type: {
            type: String,
            required: true,
            default: 'default'
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
