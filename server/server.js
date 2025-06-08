const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
//socket
const socket = require('socket.io')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/messageRoutes');
const { setOnline, setOffline } = require('./controllers/userController');

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
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    }
})

global.usersIdMapSocketId = new Map()
global.onlineUsers = new Set()

io.on('connection', socket => {
    let id = ''

    socket.on('addUser', (userId) => {
        if (!userId) return;
        global.usersIdMapSocketId.set(userId, socket.id)
        id = userId
        setOnline(id)
        global.onlineUsers.add(userId)
    })

    socket.on('sendMessage', data => {
        if (!data?.reciever || !data?.message) return;

        const socketIdOfReciever = global.usersIdMapSocketId.get(data.reciever)
        if (socketIdOfReciever) {
            socket.to(socketIdOfReciever).emit('recieveMessage', data.message)
        }
    })

    socket.on('online', userId => {
        if (userId) {
            setOnline(userId)
            global.onlineUsers.add(userId)
            io.emit('online', Array.from(global.onlineUsers))
        }
    })

    // socket.on('offline', userId => {
    //     if (userId) {
    //         setOffline(userId)
    //         global.onlineUsers.delete(userId)
    //         io.emit('offline', global.onlineUsers)
    //     }
    // })

    socket.on('typing', users => {
        console.log(users, global.usersIdMapSocketId)
        const socketIfOfWaitingUser = global.usersIdMapSocketId.get(users.waitingUser)
        console.log(socketIfOfWaitingUser)
        if (socketIfOfWaitingUser) {
            socket.to(socketIfOfWaitingUser).emit('typing', users)
        }
    })

    socket.on('disconnect', () => {
        if (id) {
            setOffline(id)
            global.onlineUsers.delete(id)
            io.emit('online', Array.from(global.onlineUsers))
            global.usersIdMapSocketId.delete(id)
        }
    })
})