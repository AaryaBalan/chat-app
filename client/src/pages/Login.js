import React, { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {

    const Navigate = useNavigate();

    const [userDetails, setUserDetails] = useState({
        username: '',
        password: '',
    });

    //useEffect if user is already logged in
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            Navigate('/');
        }
    }, [Navigate]);

    const handleLoginInputs = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    }

    // toast options
    const toastOptions = {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
        theme: "Dark",
    };

    // handleing the registration form submission
    const submitLogin = async (e) => {
        e.preventDefault();
        const { username, password } = userDetails;
        if (username.length < 3) {
            toast.error("Username must be at least 3 characters long", toastOptions);
            return;
        }
        else if (password.length < 8) {
            toast.error("Password must be at least 8 characters long", toastOptions);
            return;
        }
        try {
            const userData = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password
            });
            if (userData.data.status === false) {
                toast.error(userData.data.message, toastOptions);
            }
            else {
                toast.success(userData.data.message, toastOptions);
                setUserDetails({
                    username: '',
                    password: '',
                });
                localStorage.setItem('user', JSON.stringify(userData.data.user));
                Navigate('/')
            }
        } catch (error) {
            toast.error("An error occurred during registration", toastOptions);
        }
    }

    return (
        <>
            <div className='bg-[#131324] min-h-screen w-full flex justify-center items-center px-4 py-8'>
                <div className='bg-[#00000076] w-full max-w-md rounded-lg p-8'>
                    <form className='w-full' onSubmit={(e) => submitLogin(e)}>
                        <div className='flex flex-col items-center justify-center w-full gap-y-10'>
                            <h1 className='text-[#ea4335] font-bold text-3xl'>Vibe IT</h1>
                            <div className='flex flex-col gap-y-6 w-full'>
                                <input
                                    onChange={handleLoginInputs}
                                    name='username'
                                    value={userDetails.username}
                                    type="text"
                                    placeholder="Username"
                                    className='border-[#673ab7] border px-3 py-2 rounded-md outline-none focus:border-[#34a853] text-white bg-transparent w-full'
                                    required
                                />
                                <input
                                    onChange={handleLoginInputs}
                                    name='password'
                                    value={userDetails.password}
                                    type="password"
                                    placeholder="Password"
                                    className='border-[#673ab7] border px-3 py-2 rounded-md outline-none focus:border-[#34a853] text-white bg-transparent w-full'
                                    required
                                />
                                <button
                                    type="submit"
                                    className='bg-[#673ab7] text-white py-2 rounded-lg w-full hover:bg-[#34a853] transition duration-300 hover:scale-105'
                                >
                                    Login
                                </button>
                                <div className='text-white flex justify-center gap-x-3'>Don't have an account ? <Link to='/register' className='underline text-[#fbbc05]'>Register</Link></div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Login;
