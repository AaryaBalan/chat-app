const { default: mongoose } = require('mongoose');
const { getMessageById } = require('./messageController');
const { setOnline, setOffline, getUserById } = require('./userController');
const GroupMessage = require('../models/groupMessageModel')
const User = require('../models/userModel')

const socketControllers = (io) => {
    return socket => {
        let id = ''

        socket.on('addUser', (userId) => {
            if (!userId) return;
            global.usersIdMapSocketId.set(userId, socket.id)
            id = userId
            setOnline(id)
            global.onlineUsers.add(userId)
        })

        socket.on('sendMessage', async (data) => {
            // handle edge case
            if (!data?.reciever || !data?.message) return;

            // getting the socket id for both sender and reciever
            const socketIdOfReciever = global.usersIdMapSocketId.get(data.reciever)
            const socketIdOfSender = global.usersIdMapSocketId.get(data.sender)

            const sender = await getUserById(data.sender)
            const reciever = await getUserById(data.reciever)
            const replyMessageInfo = await getMessageById(new mongoose.Types.ObjectId(data.replyMessage))

            if (socketIdOfReciever && socketIdOfSender) {
                socket.to(socketIdOfReciever).emit('recieveMessage', {
                    message: data.message,
                    _id: data._id,
                    sender,
                    reciever,
                    replyMessage: replyMessageInfo
                })
            }
        })

        socket.on('online', userId => {
            if (userId) {
                setOnline(userId)
                global.onlineUsers.add(userId)
                io.emit('online', Array.from(global.onlineUsers))
            }
        })

        socket.on('typing', users => {
            const socketIfOfWaitingUser = global.usersIdMapSocketId.get(users.waitingUser)
            if (socketIfOfWaitingUser) {
                socket.to(socketIfOfWaitingUser).emit('typing', users)
            }
        })

        socket.on('joinedByButton', ({ username, roomId }) => {
            socket.join(roomId)
            console.log(`${username} joined room ${roomId}`);
            socket.to(roomId).emit('groupMessage', {
                type: "info",
                message: `${username} has joined the group`,
                roomId
            })
        })

        socket.on('joined', ({ username, roomId }) => {
            socket.join(roomId)
        })

        socket.on('groupMessage', async (message) => {
            try {
                const latestMessage = await GroupMessage.findOne({ roomId: message.roomId })
                    .sort({ createdAt: -1 })
                    .populate('senderId', 'username profileImage') // if you want to include user info
                    .populate({
                        path: 'replyTo',
                        populate: {
                            path: 'senderId',
                            select: 'username'
                        }
                    })
                    .exec();

                console.log(latestMessage); // ✅ Will log the latest message object

                // Emit the latest message to other users in the room
                socket.to(message.roomId).emit('groupMessage', {
                    ...latestMessage.toObject(),
                    type: 'message',
                });

            } catch (error) {
                console.error('Error fetching latest message:', error);
            }
        });

        socket.on('groupTyping', async ({ roomId, userId }) => {
            try {
                const user = await User.findById(userId)
                console.log(user)
                socket.join(roomId)
                socket.to(roomId).emit('groupTyping', user)
            } catch (err) {
                console.log(err)
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
    }
}

module.exports = socketControllers