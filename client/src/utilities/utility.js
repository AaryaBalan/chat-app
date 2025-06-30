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

// Unique colors for usernames
const userColors = [
    '#D72638', '#F46036', '#2E86AB', '#1B998B', '#C5D86D',
    '#FF6B6B', '#F7B32B', '#2D3142', '#4F5D75', '#B56576',
    '#6C5B7B', '#355C7D', '#3A86FF', '#8338EC', '#FF006E',
    '#FB5607', '#FFBE0B', '#06D6A0', '#118AB2', '#073B4C',
    '#EF476F', '#FFD166', '#06D6A0', '#118AB2', '#073B4C',
    '#0081A7', '#00AFB9', '#FDFCDC', '#FED9B7', '#F07167',
    '#00B4D8', '#90E0EF', '#0077B6', '#FFB4A2', '#E5989B',
    '#B5838D', '#6D6875', '#84A59D', '#F28482', '#F6BD60',
    '#F7EDE2', '#F5CAC3', '#F28482', '#84A59D', '#3D405B',
    '#81B29A', '#E07A5F', '#F2CC8F', '#3D5A80', '#98C1D9'
];


export const getUserColor = (userId) => {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % userColors.length);
    return userColors[index];
};

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