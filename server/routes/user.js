const express = require('express');
const { getAllUsersExpectMe } = require('../controllers/userController');
const router = express.Router();

router.get('/all/:id', getAllUsersExpectMe)

module.exports = router;