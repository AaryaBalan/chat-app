const express = require('express')
const { createRoom, getRooms } = require('../controllers/roomController')
const router = express.Router()

router.post('/create', createRoom)
router.get('/all', getRooms)

module.exports = router