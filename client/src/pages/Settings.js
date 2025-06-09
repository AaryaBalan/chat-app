import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Settings = () => {
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        username: '',
        bio: '',
        github: '',
        linkedin: '',
        dob: '',
        profileImage: '',
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            window.location.href = '/login'
            return
        }
        if (user) {
            setUserDetails((prev) => ({
                ...prev,
                ...user,
                bio: user.bio || '',
                github: user.github || '',
                linkedin: user.linkedin || '',
                dob: user.dob || '',
            }));
        }
    }, []);

    const toastOptions = {
        position: 'bottom-right',
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user._id) {
            toast.error('User not found!', toastOptions);
            return;
        }
        setLoading(true);

        try {
            // Send only userDetails as payload (not wrapped inside another object)
            const res = await axios.put(`http://localhost:5000/users/update/${user._id}`, userDetails);

            if (res.data.status === false) {
                toast.error(res.data.message || 'Update failed!', toastOptions);
            } else {
                toast.success('Profile updated!', toastOptions);

                // Remove password or any sensitive info before storing
                const updatedUser = { ...res.data.updatedUser };
                delete updatedUser.password;

                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUserDetails((prev) => ({
                    ...prev,
                    ...updatedUser,
                    bio: updatedUser.bio || '',
                    github: updatedUser.github || '',
                    linkedin: updatedUser.linkedin || '',
                    dob: updatedUser.dob || '',
                }));
            }
        } catch (err) {
            toast.error('Update failed! Please try again.', toastOptions);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="bg-[#131324] min-h-screen w-full flex justify-center items-center px-4 py-10">
                <Navbar />
                <div className="bg-[#00000076] w-full max-w-5xl rounded-lg p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <h2 className="text-white text-2xl font-bold text-center">Profile Settings</h2>

                        {/* Two Column Row */}
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left Column */}
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="flex items-center gap-x-4 self-center">
                                    {/* Profile Image: use SVG or IMG */}
                                    {userDetails.profileImage?.includes('<svg') ? (
                                        <div
                                            className="w-24 h-24"
                                            dangerouslySetInnerHTML={{ __html: userDetails.profileImage }}
                                        />
                                    ) : (
                                        <img
                                            src={userDetails.profileImage || '/default-profile.png'}
                                            alt="profile"
                                            className="w-24 h-24 object-cover rounded-full"
                                        />
                                    )}
                                    <div className="text-white font-extrabold text-2xl">{userDetails?.username}</div>
                                </div>
                                <input
                                    name="firstName"
                                    value={userDetails.firstName}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="First Name"
                                    className="bg-transparent border border-[#673ab7] text-white px-3 py-2 rounded-md focus:outline-none focus:border-[#34a853]"
                                />
                                <input
                                    name="lastName"
                                    value={userDetails.lastName}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Last Name"
                                    className="bg-transparent border border-[#673ab7] text-white px-3 py-2 rounded-md focus:outline-none focus:border-[#34a853]"
                                />
                                <input
                                    name="username"
                                    value={userDetails.username}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Username"
                                    className="bg-transparent border border-[#673ab7] text-white px-3 py-2 rounded-md focus:outline-none focus:border-[#34a853]"
                                />
                            </div>

                            {/* Right Column */}
                            <div className="flex-1 flex flex-col gap-4">
                                <textarea
                                    name="bio"
                                    value={userDetails.bio}
                                    onChange={handleChange}
                                    placeholder="Bio"
                                    rows={3}
                                    className="bg-transparent border border-[#673ab7] text-white px-3 py-2 rounded-md focus:outline-none focus:border-[#34a853]"
                                />
                                <input
                                    name="github"
                                    value={userDetails.github}
                                    onChange={handleChange}
                                    type="url"
                                    placeholder="GitHub URL"
                                    className="bg-transparent border border-[#673ab7] text-white px-3 py-2 rounded-md focus:outline-none focus:border-[#34a853]"
                                />
                                <input
                                    name="linkedin"
                                    value={userDetails.linkedin}
                                    onChange={handleChange}
                                    type="url"
                                    placeholder="LinkedIn URL"
                                    className="bg-transparent border border-[#673ab7] text-white px-3 py-2 rounded-md focus:outline-none focus:border-[#34a853]"
                                />
                                <input
                                    name="dob"
                                    value={userDetails.dob}
                                    onChange={handleChange}
                                    type="date"
                                    className="bg-transparent border border-[#673ab7] text-white px-3 py-2 rounded-md focus:outline-none focus:border-[#34a853]"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-[#673ab7] text-white py-2 rounded-lg transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#34a853] hover:scale-105'
                                }`}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default Settings;
