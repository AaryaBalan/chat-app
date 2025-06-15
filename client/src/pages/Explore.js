import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { BiLogoGmail } from 'react-icons/bi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { usersExpectMeRoute } from '../utilities/utility';

const Explore = () => {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            window.location.href = '/';
        }
    }, []);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const getAllUsersExceptMe = async () => {
            try {
                const response = await axios.get(`${usersExpectMeRoute}/${currentUser._id}`);
                if (response.data.status) {
                    setUserList(response.data.users);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error("Failed to load users.");
            }
        };

        getAllUsersExceptMe();
    }, []);

    return (
        <>
            <Navbar />
            <div className="bg-[#131324] min-h-screen w-full flex justify-center py-8 px-2 md:px-8 overflow-x-hidden">
                <div className="w-full max-w-[1500px] rounded-lg py-8 bg-[#00000076] mx-auto ">
                    <h2 className="text-white text-3xl font-bold text-center mb-10">Explore Developers</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-white px-4">
                        {userList.map((user, index) => (
                            <div
                                key={index}
                                className="bg-[#1f1f2e] rounded-xl p-6 flex flex-col items-center gap-y-4 shadow-lg hover:shadow-xl transition duration-300"
                            >
                                <div
                                    className="w-24 h-24"
                                    dangerouslySetInnerHTML={{ __html: user.profileImage }}
                                />
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}</h3>
                                    <p className="text-sm text-gray-300">@{user.username}</p>
                                    <p className="text-sm mt-2 text-gray-400 italic text-justify">{user.bio || "No bio added."}</p>
                                </div>
                                <div className="flex justify-center gap-4">
                                    <a href={`mailto:${user.email}`} className="hover:text-[#ea4335] p-1 rounded border bg-[#ea44354d] border-[#ea4335]" title="Gmail">
                                        <BiLogoGmail size={24} color='#ea4335' />
                                    </a>
                                    {user.github && (
                                        <a href={user.github} target="_blank" rel="noreferrer" className="hover:text-[#6cc644] p-1 rounded border bg-[#34a8533f] border-[#34a853]" title="GitHub">
                                            <FaGithub size={24} color='#34a853' />
                                        </a>
                                    )}
                                    {user.linkedin && (
                                        <a href={user.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#0a66c2] p-1 rounded border border-[#4285f4] bg-[#4286f465]" title="LinkedIn">
                                            <FaLinkedin size={24} color='#4285f4' />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default Explore;