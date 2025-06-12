const express = require('express')
const { addMessage, getAllMessage, getUnseenMessagesRoute, setAllSeenRoute } = require('../controllers/messageController')
const router = express.Router()

router.post('/add', addMessage)
router.post('/all', getAllMessage)
router.route('/unseen').post(getUnseenMessagesRoute).put(setAllSeenRoute)

module.exports = router