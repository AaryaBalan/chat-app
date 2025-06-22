// pages/Groups.jsx
import React, { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import CreateGroup from "../components/CreateGroup";
import GroupRooms from '../components/GroupRooms';
import GroupIcons from '../components/GroupIcons';
import { useNavigate, useParams } from 'react-router-dom';
import GroupMessage from '../components/GroupMessage';
import GroupChatInput from '../components/GroupChatInput';
import { getGroupMessageByRoomIdRoute, getRoomByIdRoute, toastOptions } from '../utilities/utility';
import axios from 'axios';
import Navbar from '../components/Navbar'
import { toast, ToastContainer } from 'react-toastify';

const Groups = ({ socketRef }) => {
    const Navigate = useNavigate()
    const { id } = useParams();

    const [rooms, setRooms] = useState([]);
    const [createGroup, setCreateGroup] = useState(false);
    const [showGroupIcon, setShowGroupIcon] = useState(false);
    const [roomDetails, setRoomDetails] = useState({ roomName: "", roomDescription: "" });
    const [room, setRoom] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [groupMessages, setGroupMessages] = useState([])

    const [replyMessage, setReplyMessage] = useState({})

    useEffect(() => {
        const getRoomById = async () => {
            if (!id) {
                setIsLoaded(false)
                return
            };
            try {
                const room = await axios.get(`${getRoomByIdRoute}/${id}`);
                console.log(room.data)
                setRoom(room.data);
                setIsLoaded(true);
                if (!room.data) {
                    Navigate('/groups')
                }
            } catch (error) {
                console.error("Failed to fetch room data", error);
                setIsLoaded(false);
            }
        };
        getRoomById();
    }, [id, Navigate]);

    console.log(groupMessages)
    // fetching messages for particular room id
    useEffect(() => {
        setGroupMessages([])
        const getMessages = async () => {
            try {
                const messages = await axios.get(`${getGroupMessageByRoomIdRoute}/${id}`)
                console.log(messages.data)
                setGroupMessages(messages.data)
            } catch (err) {
                console.log(err)
            }
        }
        if (id) {
            getMessages()
        }
    }, [id])

    useEffect(() => {
        const socket = socketRef.current;
        const user = JSON.parse(localStorage.getItem('user'));

        if (!room || !room._id || !user || !socket) return;

        const alreadyMember = room.membersList?.includes(user._id);

        if (alreadyMember) {
            socket.emit("joined", {
                roomId: room._id,
                username: user.username,
            });
            console.log("Auto-joined room:", room._id);
        } else {
            console.log("User is not a member of this room");
        }

    }, [room, socketRef]);

    useEffect(() => {
        const socket = socketRef.current;

        const handleGroupMessage = (payload) => {
            console.log(payload)
            if (payload.type === 'message' && payload.roomId === id) {
                setGroupMessages(prev => [...prev, payload])
            }
            else if (payload.type === 'info' && payload.roomId === id) {
                console.log(payload)
                toast.info(payload.message, toastOptions)
            }
        };
        socket.on('groupMessage', handleGroupMessage);

        return () => {
            socket.off('groupMessage', handleGroupMessage);
        };
    }, [room, socketRef, id])


    return (
        <div className='bg-[#131324] h-screen w-full flex justify-center items-center px-4 py-8'>
            <Navbar />
            <div className='bg-[#00000076] w-full max-w-7xl h-[90vh] rounded-lg overflow-hidden'>
                <div className='w-full h-full flex flex-col md:flex-row'>

                    {/* Sidebar - Visible on mobile if no group selected, always visible on desktop */}
                    <div className={`${id ? 'hidden' : 'flex'} md:flex w-full md:w-1/3 bg-[#13132428] p-3 flex-col gap-y-4`}>
                        <div className='flex justify-between items-center'>
                            <div className='text-white font-semibold'>Groups</div>
                            <div
                                className={`${createGroup ? "rotate-45" : ""} transition-all cursor-pointer`}
                                onClick={() => setCreateGroup(prev => !prev)}
                            >
                                <FaPlus size={20} color='white' />
                            </div>
                        </div>

                        {createGroup ? (
                            <CreateGroup
                                setShowGroupIcon={setShowGroupIcon}
                                roomDetails={roomDetails}
                                setRoomDetails={setRoomDetails}
                                setCreateGroup={setCreateGroup}
                                socketRef={socketRef}
                            />
                        ) : (
                            <GroupRooms
                                rooms={rooms}
                                setRooms={setRooms}
                                groupMessages={groupMessages}
                            />
                        )}
                    </div>

                    {/* Chat Section - Visible when group is selected */}
                    {showGroupIcon ? (
                        <GroupIcons
                            roomDetails={roomDetails}
                            setRoomDetails={setRoomDetails}
                        />
                    ) : (
                        <div className={`${id ? 'flex' : 'hidden'} md:flex w-full md:w-2/3 h-full flex-col`}>
                            {isLoaded ? (
                                <>
                                    <div className='flex-1 overflow-y-auto px-4 py-2'>
                                        <GroupMessage
                                            room={room}
                                            groupMessages={groupMessages}
                                            setReplyMessage={setReplyMessage}
                                            socketRef={socketRef}
                                            rooms={rooms}
                                            setRooms={setRooms}
                                        />
                                    </div>
                                    <div className='border-t border-[#673ab7] px-4 py-2'>
                                        <GroupChatInput
                                            room={room}
                                            setRoom={setRoom}
                                            socketRef={socketRef}
                                            setGroupMessages={setGroupMessages}
                                            replyMessage={replyMessage}
                                            setReplyMessage={setReplyMessage}
                                            rooms={rooms}
                                            setRooms={setRooms}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className='flex-1 flex items-center justify-center text-white'>
                                    Loading chat...
                                </div>
                            )}
                        </div>
                    )}
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
};

export default Groups;
