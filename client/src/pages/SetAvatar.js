import React, { useEffect, useState } from 'react'
import multiavatar from '@multiavatar/multiavatar';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TfiReload } from "react-icons/tfi";

const SetAvatar = () => {
    const Navigate = useNavigate();
    const [avatarLists, setavatarLists] = useState([]);
    const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null);

    //
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user.isProfileImageSet) {
            Navigate('/');
        }
    }, [Navigate])

    useEffect(() => {
        // create 8 random avatars
        function createRandomAvatars() {
            const avatars = [];
            for (let i = 0; i < 10; i++) {
                const randomAvatar = multiavatar(`${Math.random()}`);
                avatars.push(randomAvatar);
            }
            setavatarLists(avatars);
            return avatars;
        }
        createRandomAvatars();
    }, [])

    function selectAvatar(index) {
        setSelectedAvatarIndex(index);
    }

    // toast options
    const toastOptions = {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
        theme: "Dark",
    };

    function setProfileImage() {
        if (selectedAvatarIndex === null) {
            toast.error("Please select an avatar", toastOptions);
            return;
        }
        const user = JSON.parse(localStorage.getItem('user'));
        const sendProfileImage = async () => {
            try {
                const { data } = await axios.post(`http://localhost:5000/api/auth/setAvatar/${user._id}`, {
                    profileImage: avatarLists[selectedAvatarIndex]
                })
                if (data.status === false) {
                    toast.error(data.message, toastOptions);
                }
                else {
                    user.isProfileImageSet = true;
                    user.profileImage = avatarLists[selectedAvatarIndex];
                    localStorage.setItem('user', JSON.stringify(user));
                    toast.success(data.message, toastOptions);
                    window.location.href = '/';
                }
            } catch (error) {
                toast.error("Error setting profile image", toastOptions);
            }
        }
        sendProfileImage();
    }

    return (
        <>
            <div className='bg-[#131324] min-h-screen w-full flex justify-center items-center px-4 py-8'>
                <div className='bg-[#00000076] w-full max-w-2xl rounded-lg p-8 flex flex-col gap-y-10'>
                    <h1 className='text-white text-center text-4xl font-bold'>Pick your Avatar</h1>
                    <div className='flex flex-wrap justify-center items-center gap-x-8 gap-y-10 mt-6'>
                        {
                            avatarLists.map((avatar, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center justify-center cursor-pointer`}
                                    onClick={() => selectAvatar(index)}
                                >
                                    <div
                                        className={`w-24 h-24 ${selectedAvatarIndex === index ? 'border-[#673ab7] border-5 rounded-full scale-125' : ''} hover:scale-125 transition-all`}
                                        dangerouslySetInnerHTML={{ __html: avatar }}
                                    />
                                </div>
                            ))
                        }
                    </div>
                    <div className='flex justify-between'>
                        <button
                            onClick={() => window.location.reload()}
                            className='bg-[#673ab7] text-white font-bold py-2 rounded-lg w-fit px-4 hover:bg-[#ea4335] transition duration-300 cursor-pointer flex items-center gap-x-2'
                        >
                            <TfiReload size={20} /> <span>Load more avatar...</span>
                        </button>
                        <button
                            onClick={setProfileImage}
                            className='bg-[#fbbc05] text-black font-bold py-2 rounded-lg w-fit px-4 hover:bg-[#34a853] transition duration-300 cursor-pointer'
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default SetAvatar