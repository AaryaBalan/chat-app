import React, { useState, useRef, useEffect } from 'react';
import { LuSticker, LuSendHorizontal } from 'react-icons/lu';
import { IoCloseSharp } from "react-icons/io5";
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import notification from '../assets/notification.mp3'
import { formatMessage } from '../utilities/utility';

const ChatInput = ({
    unreadMessage,
    setIsReply,
    isReply,
    replyMessage,
    setReplyMessage,
    setLatestMessage,
    setUserList,
    handleLatestSelfMessage,
    chatPerson,
    socketRef
}) => {

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

        const currentUser = JSON.parse(localStorage.getItem('user'))

        let replyId = null
        // uploading in db
        if (isReply && replyMessage.message.length !== 0) {
            replyId = replyMessage._id
        }

        const { data } = await axios.post('http://localhost:5000/message/add', {
            sender: currentUser._id,
            reciever: chatPerson._id,
            message: messageInput,
            replyMessage: replyId
        })

        //emiting sockets
        socketRef.current.emit('sendMessage', {
            sender: currentUser._id,
            reciever: chatPerson._id,
            message: messageInput,
            _id: data.message._id,
            replyMessage: replyId
        })

        //empty the text area
        setMessageInput('');
        setIsReply(false)
        setReplyMessage(null)
        // update the latest self message with time to render it in message area
        handleLatestSelfMessage(data.message._id, data.message.message, data.message.createdAt, replyMessage)
        // update the latest message to render it in contacts components
        setLatestMessage({
            sender: currentUser,
            reciever: chatPerson,
            message: data.message.message
        })
        //deleting the unread message becoz user sent the message to that person
        delete unreadMessage[chatPerson._id]
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

    const cancelReply = () => {
        setIsReply(false)
        setReplyMessage(null)
    }

    useEffect(() => {
        if (textareaRef.current) {
            // input is focus
            textareaRef.current.focus()
        }
    }, [isReply, replyMessage])

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

            {
                isReply &&
                <div className='flex justify-between mb-2 gap-x-3 items-center'>
                    <div className='py-1 px-2  rounded-md ml-10 bg-[#ffffff21] text-white w-full break-all'>
                        {formatMessage(replyMessage.message)}
                    </div>
                    <div className='bg-[#ea4335] px-3 p-0.5 rounded-md cursor-pointer' onClick={cancelReply}>
                        <IoCloseSharp size={24}/>
                    </div>
                </div>
            }

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-5xl mx-auto">
                <button
                    ref={emojiButtonRef}
                    type="button"
                    className="text-[#fbbc05] cursor-pointer"
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
                    onKeyDown={(e) => handleTyping(e)}
                />
                <button
                    type="submit"
                    className={`focus:bg-[#34a853] focus:text-white p-1 rounded-md outline-none ${messageInput.trim()
                        ? "text-[#34a853] cursor-pointer"
                        : "text-[#ea4335] cursor-not-allowed"
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
