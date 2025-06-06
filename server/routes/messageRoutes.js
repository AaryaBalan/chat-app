const express = require('express')
const { addMessage, getAllMessage } = require('../controllers/messageController')
const router = express.Router()

router.post('/add', addMessage)
router.post('/all', getAllMessage)

module.exports = router