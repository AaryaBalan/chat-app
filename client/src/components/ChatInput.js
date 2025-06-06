import React, { useState, useRef, useEffect } from 'react';
import { LuSticker, LuSendHorizontal } from 'react-icons/lu';
import Picker from 'emoji-picker-react';
import axios from 'axios';

const ChatInput = ({ chatPerson }) => {
    const [message, setMessage] = useState('');
    const [isEmojiDisplay, setIsEmojiDisplay] = useState(false);
    const emojiPickerRef = useRef(null);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        const { data } = await axios.post('http://localhost:5000/message/add', {
            sender: JSON.parse(localStorage.getItem('user'))._id,
            reciever: chatPerson._id,
            message
        })
        console.log("Sending message:", data);
        setMessage('');
    };

    // Close emoji picker on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
                setIsEmojiDisplay(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative p-4 shadow-md bg-[#0a0a13] border-b-2 border-x-2 border-[#673ab7] rounded-b-2xl">
            {/* Emoji Picker */}
            {isEmojiDisplay && (
                <div
                    ref={emojiPickerRef}
                    className="absolute bottom-[65px] left-4 z-50"
                >
                    <Picker
                        emojiStyle="apple"
                        theme="dark"
                        onEmojiClick={(emojiData) => {
                            setMessage(prev => prev + emojiData.emoji);
                        }}
                    />
                </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-5xl mx-auto">
                <button
                    type="button"
                    className="p-1 bg-[#fbbc05] text-gray-800 border rounded-md"
                    title="Emoji"
                    onClick={() => setIsEmojiDisplay(prev => !prev)}
                >
                    <LuSticker size={30} />
                </button>
                <textarea
                    type="text"
                    name="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 rounded-md text-white bg-[#131324] outline-none h-20"
                    autoComplete="off"
                />
                <button
                    type="submit"
                    className={`p-1 rounded-md text-white ${message.trim()
                        ? "bg-[#34a853] cursor-pointer"
                        : "bg-[#ea4335] cursor-not-allowed"
                        }`}
                    disabled={!message.trim()}
                    title="Send Message"
                >
                    <LuSendHorizontal size={30} />
                </button>
            </form>
        </div>
    );
};

export default ChatInput;
