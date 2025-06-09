import React from 'react'
import { BiLogoGmail } from 'react-icons/bi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const UserInfo = ({ user }) => {
    console.log(user)
    return (
        <div className="max-w-md bg-[#1f1f2e] text-white rounded-xl shadow-lg p-6 flex flex-col items-center gap-y-4">
            {/* Profile Image */}
            <div
                className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#673ab7]"
                dangerouslySetInnerHTML={{ __html: user?.profileImage }}
            />

            {/* Name & Username */}
            <div className="text-center">
                <h2 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h2>
                <p className="text-sm text-gray-400">@{user?.username}</p>
            </div>

            {/* Bio */}
            <p className="text-sm italic text-gray-300 text-center px-4">{user?.bio || "No bio available."}</p>

            {/* Contact Icons */}
            <div className="flex gap-4 mt-2">
                <a href={`mailto:${user?.email}`} className="hover:text-[#ea4335]" title="Gmail">
                    <BiLogoGmail size={24} />
                </a>
                {user?.github && (
                    <a href={user?.github} target="_blank" rel="noreferrer" className="hover:text-[#6cc644]" title="GitHub">
                        <FaGithub size={24} />
                    </a>
                )}
                {user?.linkedin && (
                    <a href={user?.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#0a66c2]" title="LinkedIn">
                        <FaLinkedin size={24} />
                    </a>
                )}
            </div>
        </div>
    )
}

export default UserInfo