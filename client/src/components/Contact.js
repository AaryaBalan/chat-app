import React from 'react';

const Contact = ({ userList, currentUser, handleChatPerson, chatPerson }) => {

    function handleChatChange(user) {
        handleChatPerson(user)
    }

    return (
        <div className="flex flex-col gap-y-5 h-full w-full">
            {/* Scrollable Contact List */}
            <div className="flex flex-col gap-y-4 overflow-y-auto max-h-[70vh] md:max-h-full pr-2 text-white">
                {userList.map((user, index) => (
                    <div
                        onClick={() => handleChatChange(user)}
                        key={index}
                        className={`cursor-pointer bg-[#202123] p-4 rounded-lg flex items-center gap-4 w-full hover:bg-[#fbbc05] hover:text-black transition ${chatPerson?._id === user?._id ? "bg-[#fbbc05] text-black" : ""}`}
                    >
                        <div
                            className="w-12 h-12 md:w-16 md:h-16"
                            dangerouslySetInnerHTML={{ __html: user.profileImage }}
                        />
                        <h2 className="text-base md:text-lg font-semibold truncate text-inherit">{user.username}</h2>
                    </div>
                ))}
            </div>

            {/* Current User Display */}
            <div className="mt-4 bg-[#ea4335] p-4 rounded-lg flex items-center gap-4 w-full shrink-0">
                <div
                    className="w-12 h-12 md:w-16 md:h-16"
                    dangerouslySetInnerHTML={{ __html: currentUser?.profileImage }}
                />
                <h2 className="text-white text-base md:text-lg font-semibold truncate">{currentUser?.username}</h2>
            </div>
        </div>
    );
};

export default Contact;
