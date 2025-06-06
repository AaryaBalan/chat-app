const express = require('express');
const router = express.Router();
const { registerUser, loginUser, setProfileImage } = require('../controllers/authController');

router.post('/register', registerUser)
// login post route
router.post('/login', loginUser)
//setting the profile picture
router.post('/setAvatar/:id', setProfileImage);

module.exports = router;