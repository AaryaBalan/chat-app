const { default: mongoose } = require('mongoose');
const { getMessageById } = require('./messageController');
const { setOnline, setOffline, getUserById } = require('./userController');

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