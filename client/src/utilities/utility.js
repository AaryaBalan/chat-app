import { identicon, rings, shapes } from "@dicebear/collection";
import React from "react";

// format the user message
export const formatMessage = (text) => {
    if (!text) return null;
    const linkRegex = /((https?:\/\/|www\.)[^\s]+|(?:[a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?)/gi;

    const parts = text.split('\n');
    return parts.map((part, index) => (
        <React.Fragment key={index}>
            {
                part.split(linkRegex).map((chunk, i) => {
                    if (chunk?.match(linkRegex)) {
                        const hasHttp = chunk.startsWith('http://') || chunk.startsWith('https://');
                        const url = hasHttp ? chunk : `https://${chunk}`;
                        return (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="underline text-[#4fa0ff] hover:text-[hsl(212,100%,50%)]">
                                {chunk}
                            </a>
                        );
                    }
                    return chunk;
                })
            }
            <br />
        </React.Fragment>
    ));
};

// toast options
export const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

// avatar 
export const avatarTypes = {
    identicon: identicon,
    rings: rings,
    shapes: shapes
}

export const BASE_URL = window.location.hostname === "localhost" ? "http://localhost:5000" : "http://192.168.31.103:5000";

// auth routes
export const registerRoute = `${BASE_URL}/api/auth/register`
export const loginRoute = `${BASE_URL}/api/auth/login`
export const setAvatarRoute = `${BASE_URL}/api/auth/setAvatar` // userId

// users route
export const usersExpectMeRoute = `${BASE_URL}/users/all` // userId
export const recentUsersRoute = `${BASE_URL}/users/recent`
export const updateUserRoute = `${BASE_URL}/users/update` // userId

// message route
export const addMessageRoute = `${BASE_URL}/message/add`
export const allMessageRoute = `${BASE_URL}/message/all`
export const unseenMessageRoute = `${BASE_URL}/message/unseen`

// room routes
export const createRoomRoute = `${BASE_URL}/room/create`
export const getAllRooms = `${BASE_URL}/room/all`
export const getRoomByIdRoute = `${BASE_URL}/room` // room id
export const getRecentRoomsRoute = `${BASE_URL}/room/recent` // pass userid in body
export const updateRoomRoute = `${BASE_URL}/room/update/join`

// group message routes 
export const addGroupMessageRoute = `${BASE_URL}/groupMessage/add`
export const getGroupMessageByRoomIdRoute = `${BASE_URL}/groupMessage/message` // roomId