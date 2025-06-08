import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Contact from '../components/Contact';
import ChatArea from '../components/ChatArea';
import DefaultChat from '../components/DefaultChat';
import { io } from 'socket.io-client'

const Chat = () => {
    const navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
    const [chatPerson, setChatPerson] = useState(undefined);
    const socketRef = useRef()
    const [onlineUsers, setOnlineUsers] = useState([])

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setCurrentUser(user);
        setIsLoaded(true);
        if (!user) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const getAllUsersExceptMe = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/users/all/${user._id}`);
                if (data.status === false) {
                    console.error(data.message);
                } else {
                    setUserList(data.users);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        getAllUsersExceptMe();
    }, []);

    useEffect(() => {
        if (currentUser && currentUser._id) {
            socketRef.current = io('http://localhost:5000/')
            socketRef.current.emit('online', currentUser._id)
            socketRef.current.emit('addUser', currentUser._id)
            socketRef.current.on('online', users => setOnlineUsers(users))
        }
    }, [currentUser])

    function handleChatPerson(person) {
        setChatPerson(person);
    }

    return (
        <div className="bg-[#131324] min-h-screen w-full flex justify-center items-center px-2 py-4 md:px-6 md:py-10">
            <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-6 bg-[#00000076] w-full max-w-7xl rounded-lg p-4 md:p-8 h-[90vh] overflow-hidden">

                {/* CONTACTS */}
                {isLoaded && (
                    <div
                        className={`
                            ${chatPerson ? 'hidden' : 'block'}
                            w-full h-full
                            md:block md:w-1/3 md:h-full
                        `}
                    >
                        <Contact
                            setUserList={setUserList}
                            userList={userList}
                            currentUser={currentUser}
                            handleChatPerson={handleChatPerson}
                            chatPerson={chatPerson}
                            onlineUsers={onlineUsers}
                            socketRef={socketRef}
                        />
                    </div>
                )}

                {/* CHAT AREA */}
                {
                    chatPerson &&
                    <div
                        className={`
                        ${chatPerson ? 'block' : 'hidden'}
                        w-full h-full
                        md:block md:w-2/3 md:h-full
                    `}
                    >
                        <ChatArea
                            setUserList={setUserList}
                            chatPerson={chatPerson}
                            setChatPerson={setChatPerson}
                            socketRef={socketRef}
                        />
                    </div>
                }


                {/* default chat */}
                {chatPerson === undefined &&
                    <div className={`
                        ${chatPerson ? 'block' : 'hidden'}
                        w-full h-full
                        md:block md:w-2/3 md:h-full
                    `}>
                        < DefaultChat />
                    </div>
                }
            </div>
        </div>
    );
};

export default Chat;
