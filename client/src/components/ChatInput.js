import React, { useState, useRef, useEffect } from 'react';
import { LuSticker, LuSendHorizontal } from 'react-icons/lu';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import notification from '../assets/notification.mp3'

const ChatInput = ({ setLatestMessage, setUserList, handleLatestSelfMessage, chatPerson, socketRef }) => {
    const [messageInput, setMessageInput] = useState('');
    const [isEmojiDisplay, setIsEmojiDisplay] = useState(false);
    const emojiPickerRef = useRef(null);
    const emojiButtonRef = useRef(null);
    const textareaRef = useRef(null);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const audio = new Audio(notification);
        audio.play();

        console.log(socketRef.current?.connected)
        const currentUser = JSON.parse(localStorage.getItem('user'))

        //emiting sockets
        socketRef.current.emit('sendMessage', {
            sender: currentUser._id,
            reciever: chatPerson._id,
            message: messageInput
        })

        // uploading in db
        const { data } = await axios.post('http://localhost:5000/message/add', {
            sender: currentUser._id,
            reciever: chatPerson._id,
            message: messageInput
        })

        //empty the text area
        setMessageInput('');
        // update the latest self message with time to render it in message area
        handleLatestSelfMessage(data.message.message, data.message.createdAt)
        // update the latest message to render it in contacts components
        setLatestMessage({
            sender: currentUser,
            reciever: chatPerson,
            message: data.message.message
        })
        // update the recent user with the atmost top
        setUserList(prev => {
            const filtered = prev.filter(user => user._id !== chatPerson._id)
            return [chatPerson, ...filtered]
        })
    };

    // Close emoji picker on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(e.target) &&
                emojiButtonRef.current &&
                !emojiButtonRef.current.contains(e.target)
            ) {
                setIsEmojiDisplay(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // dynamic height update
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
        }
    }, [messageInput]);

    const handleTyping = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage(e)
        }
        socketRef.current.emit('typing', {
            typingUser: JSON.parse(localStorage.getItem('user'))._id,
            waitingUser: chatPerson._id,
        })
    }

    return (
        <div className="relative p-4 shadow-md bg-[#0a0a13] border-b-2 border-x-2 border-[#673ab7] rounded-b-2xl">
            {/* Emoji Picker */}
            {isEmojiDisplay && (
                <div
                    ref={emojiPickerRef}
                    className="absolute bottom-[65px] left-4 z-50"
                >
                    <EmojiPicker
                        emojiStyle="apple"
                        theme="dark"
                        onEmojiClick={(emojiData) => {
                            setMessageInput(prev => prev + emojiData.emoji);
                        }}
                    />
                </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-5xl mx-auto">
                <button
                    ref={emojiButtonRef}
                    type="button"
                    className="p-1 bg-[#fbbc05] text-gray-800 border rounded-md cursor-pointer"
                    title="Emoji"
                    onClick={() => setIsEmojiDisplay(prev => !prev)}
                >
                    <LuSticker size={30} />
                </button>
                <textarea
                    type="text"
                    name="message"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 rounded-md text-white bg-[#131324] outline-none max-h-32"
                    autoComplete="off"
                    rows={1}
                    ref={textareaRef}
                    onKeyUp={(e) => handleTyping(e)}
                />
                <button
                    type="submit"
                    className={`p-1 rounded-md text-white outline-none ${messageInput.trim()
                        ? "bg-[#34a853] cursor-pointer"
                        : "bg-[#ea4335] cursor-not-allowed"
                        }`}
                    disabled={!messageInput.trim()}
                    title="Send Message"
                >
                    <LuSendHorizontal size={30} />
                </button>
            </form>
        </div>
    );
};

export default ChatInput;
