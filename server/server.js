const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
//socket
const socket = require('socket.io')
const socketControllers = require('./controllers/socketControllers')

const allowedOrigins = [
    'http://localhost:3000',
    'http://192.168.31.103:3000'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/messageRoutes');
const roomRoutes = require('./routes/roomRoutes');

app.use('/api/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/message', messageRoutes)
app.use('/room', roomRoutes)

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const server = app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

const io = socket(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true
    }
});

global.usersIdMapSocketId = new Map()
global.onlineUsers = new Set()

io.on('connection', socketControllers(io))