const express = require('express')
const { createRoom, getRooms, getRoomById, joinRoom, getRecentRoomsByUserIdRoute } = require('../controllers/roomController')
const router = express.Router()

router.post('/create', createRoom)
router.get('/all', getRooms)
router.get('/:roomId', getRoomById)
router.put('/update/join', joinRoom)
router.post('/recent', getRecentRoomsByUserIdRoute)

module.exports = router