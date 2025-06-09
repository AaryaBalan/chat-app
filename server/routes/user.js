const express = require('express');
const { getAllUsersExpectMe, getRecentUsers, updateUserByIdRoute } = require('../controllers/userController');
const router = express.Router();

router.get('/all/:id', getAllUsersExpectMe)
router.post('/recent', getRecentUsers)
router.put('/update/:userId', updateUserByIdRoute)

module.exports = router;