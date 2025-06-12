const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
//socket
const socket = require('socket.io')
const socketControllers = require('./controllers/socketControllers')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/messageRoutes');

app.use('/api/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/message', messageRoutes)

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const server = app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

const io = socket(server, {
    connectionStateRecovery: {},
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    }
})

global.usersIdMapSocketId = new Map()
global.onlineUsers = new Set()

io.on('connection', socketControllers(io))