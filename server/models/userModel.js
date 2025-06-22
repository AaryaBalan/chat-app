const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 50,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    firstName: {
        type: String,
        maxlength: 30,
        default: "",
    },
    lastName: {
        type: String,
        maxlength: 30,
        default: "",
    },
    bio: {
        type: String,
        maxlength: 500,
        default: "",
    },
    github: {
        type: String,
        maxlength: 100,
        default: "",
    },
    linkedin: {
        type: String,
        maxlength: 100,
        default: "",
    },
    dob: {
        type: Date,
    },
    isProfileImageSet: {
        type: Boolean,
        default: false,
    },
    profileImage: {
        type: String,
        default: "",
    },
    active: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

module.exports = mongoose.model("User", userSchema);
