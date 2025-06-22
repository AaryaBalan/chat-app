import React, { useState, useRef, useEffect } from 'react';
import { LuSticker, LuSendHorizontal } from 'react-icons/lu';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import { updateRoomRoute, toastOptions, addGroupMessageRoute, formatMessage } from '../utilities/utility';
import { toast, ToastContainer } from 'react-toastify';
import notification from '../assets/notification.mp3'
import { IoCloseSharp } from "react-icons/io5";


const GroupChatInput = ({
    room,
    setRoom,
    socketRef,
    setGroupMessages,
    replyMessage,
    setReplyMessage,
    rooms,
    setRooms
}) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [messageInput, setMessageInput] = useState('');
    const [isEmojiDisplay, setIsEmojiDisplay] = useState(false);
    const emojiPickerRef = useRef(null);
    const emojiButtonRef = useRef(null);
    const textareaRef = useRef(null);

    // Adjust textarea height dynamically
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [messageInput]);

    // Close emoji picker on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target) &&
                !emojiButtonRef.current.contains(event.target)
            ) {
                setIsEmojiDisplay(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // handle emoji click
    const handleEmojiClick = (emojiData) => {
        setMessageInput((prev) => prev + emojiData.emoji);
    };

    // send message function
    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!messageInput.trim()) return;

        // play the audio when the user sent the message
        const audio = new Audio(notification);
        audio.play();

        const user = JSON.parse(localStorage.getItem('user'));

        try {
            const message = await axios.post(addGroupMessageRoute, {
                message: messageInput.trim(),
                senderId: user._id,
                roomId: room._id,
                replyTo: replyMessage._id || null
            })
            console.log(message.data)
            setMessageInput("")

            socketRef.current.emit('groupMessage', {
                type: 'message',
                message: messageInput.trim(),
                senderId: user._id,
                roomId: room._id
            })
            setGroupMessages(prev => [...prev, message.data])
            setReplyMessage({})
            setRooms(prev => {
                const filter = prev.filter(prevRoom => prevRoom._id !== room._id)
                // const expected = prev.filter(prevRoom => prevRoom._id === room._id)
                console.log(room, filter)
                return [room, ...filter]
            })

        } catch (err) {
            console.log(err)
        }

    };

    const handleJoinRoom = async () => {
        try {
            const updateRoom = await axios.put(updateRoomRoute, {
                userId: user._id,
                roomId: room._id
            })
            if (updateRoom.data.status === false) {
                toast.error(updateRoom.data.message, toastOptions)
            }
            else {
                toast.success("Successfully joined", toastOptions)
                socketRef.current.emit('joinedByButton', {
                    username: user.username,
                    roomId: room._id
                })
                setRoom(updateRoom.data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    //handle typing
    const handleTyping = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage(e)
        }
        socketRef.current.emit('groupTyping', {
            roomId: room._id,
            userId: JSON.parse(localStorage.getItem('user'))._id,
        })
    }

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus()
        }
    }, [replyMessage])


    return (
        <div className="relative px-4 py-2 bg-[#0a0a13] rounded-2xl">
            {
                replyMessage.message &&
                <div className='flex justify-between mb-2 gap-x-3 items-center'>
                    <div className='py-1 px-2  rounded-md ml-10 bg-[#ffffff21] text-white w-full break-all'>
                        {formatMessage(replyMessage.message)}
                    </div>
                    <div className='bg-[#ea4335] px-3 p-0.5 rounded-md cursor-pointer' onClick={() => setReplyMessage({})}>
                        <IoCloseSharp size={24} />
                    </div>
                </div>
            }
            {
                room?.membersList.includes(user._id) ?
                    <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
                        {/* Emoji Button */}
                        <button
                            ref={emojiButtonRef}
                            type="button"
                            className="text-[#fbbc05] mt-"
                            title="Emoji"
                            onClick={() => setIsEmojiDisplay(prev => !prev)}
                        >
                            <LuSticker size={28} />
                        </button>

                        {/* Emoji Picker */}
                        {isEmojiDisplay && (
                            <div ref={emojiPickerRef} className="absolute bottom-20 left-4 z-50">
                                <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
                            </div>
                        )}

                        {/* Auto-growing Textarea */}
                        <textarea
                            ref={textareaRef}
                            name="message"
                            placeholder="Type a message..."
                            className="flex-1 p-2 rounded-md text-white bg-[#131324] outline-none max-h-40 resize-none overflow-hidden"
                            autoComplete="off"
                            rows="1"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={handleTyping}
                        />

                        {/* Send Button */}
                        <button
                            type="submit"
                            className="text-[#34a853] hover:text-white hover:bg-[#34a853] p-1 rounded-md transition"
                            title="Send Message"
                        >
                            <LuSendHorizontal size={28} />
                        </button>
                    </form>
                    :
                    <div onClick={handleJoinRoom} className="text-white text-center py-2 w-full cursor-pointer bg-[#34a853] rounded-2xl">
                        Join Group
                    </div>
            }
            <ToastContainer />
        </div>
    );
};

export default GroupChatInput;
