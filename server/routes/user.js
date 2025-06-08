const express = require('express');
const { getAllUsersExpectMe, getRecentUsers } = require('../controllers/userController');
const router = express.Router();

router.get('/all/:id', getAllUsersExpectMe)
router.post('/recent', getRecentUsers)

module.exports = router;