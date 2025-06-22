const express = require('express')
const { addGroupMessage, getGroupMessageByRoomId } = require('../controllers/groupMessageController')
const router = express.Router()

router.post('/add', addGroupMessage)
router.get('/message/:roomId', getGroupMessageByRoomId)

module.exports = router