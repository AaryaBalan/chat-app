import React, { useEffect, useRef, useState } from 'react';
import { FaHome, FaCompass, FaUsers, FaUserCircle, FaCog, FaBars, FaPowerOff } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(e.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navItems = [
        { label: "Home", icon: <FaHome />, link: "/" },
        { label: "Explore", icon: <FaCompass />, link: "/explore" },
        { label: "Groups", icon: <FaUsers />, link: "/groups" },
        { label: "Profile", icon: <FaUserCircle />, link: "/profile" },
        { label: "Settings", icon: <FaCog />, link: "/settings" },
    ];

    // logout function
    const logout = () => {
        localStorage.clear()
        window.location.href = '/login'
    }

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(prev => !prev)}
                className="fixed top-4 left-4 z-50 bg-yellow-400 text-black p-2 rounded-md shadow-md hover:bg-yellow-300"
            >
                {!isOpen ?
                    <FaBars size={20} /> : <IoCloseSharp size={20} />
                }
            </button>

            <div
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-full w-64 z-40 bg-[#0a0a13] text-white shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-4 mt-14">
                    <h2 className="text-xl font-bold text-yellow-400 mb-6 px-3">Chat system</h2>
                    {navItems.map((item, index) => (
                        <Link to={item.link}
                            onClick={() => setIsOpen(false)}
                            key={index}
                            className="flex items-center gap-3 w-full text-left px-3 py-2 mb-2 rounded-md hover:bg-[#333144] transition-colors"
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span className="">{item.label}</span>
                        </Link>
                    ))}
                    <div className='flex items-center gap-3 w-full text-left px-3 py-2 mb-2 rounded-md hover:bg-[#333144] transition-colors cursor-pointer' onClick={logout}>
                        <span className="text-lg"><FaPowerOff /></span>
                        <span className="">Logout</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
