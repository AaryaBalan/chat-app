import React, { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { registerRoute, toastOptions } from '../utilities/utility';

const Register = () => {

    const Navigate = useNavigate();

    const [userDetails, setUserDetails] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    //useEffect if user is already logged in
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            Navigate('/setAvatar');
        }
    }, [Navigate]);

    const handleRegisterInputs = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    }

    // handleing the registration form submission
    const submitRegisteration = async (e) => {
        e.preventDefault();
        const { username, email, password, confirmPassword } = userDetails;
        if (password !== confirmPassword) {
            toast.error("Passwords do not match", toastOptions);
            return;
        }
        else if (username.length < 3) {
            toast.error("Username must be at least 3 characters long", toastOptions);
            return;
        }
        else if (password.length < 8) {
            toast.error("Password must be at least 8 characters long", toastOptions);
            return;
        }
        try {
            const userData = await axios.post(registerRoute, {
                username,
                email,
                password
            });
            if (userData.data.status === false) {
                toast.error(userData.data.message, toastOptions);
            }
            else {
                toast.success(userData.data.message, toastOptions);
                setUserDetails({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
                localStorage.setItem('user', JSON.stringify(userData.data.user));
                Navigate('/setAvatar');
            }
        } catch (error) {
            toast.error("An error occurred during registration", toastOptions);
        }
    }

    return (
        <>
            <div className='bg-[#131324] min-h-[100dvh] w-full flex justify-center items-center px-4 py-8'>
                <div className='bg-[#00000076] w-full max-w-md rounded-lg p-8'>
                    <form className='w-full' onSubmit={(e) => submitRegisteration(e)}>
                        <div className='flex flex-col items-center justify-center w-full gap-y-10'>
                            <h1 className='text-white text-3xl font-semibold'>Vibe IT</h1>
                            <div className='flex flex-col gap-y-6 w-full'>
                                <input
                                    onChange={handleRegisterInputs}
                                    name='username'
                                    value={userDetails.username}
                                    type="text"
                                    placeholder="Username"
                                    className='border-[#673ab7] border px-3 py-2 rounded-md outline-none focus:border-[#34a853] text-white bg-transparent w-full'
                                    required
                                />
                                <input
                                    onChange={handleRegisterInputs}
                                    name='email'
                                    value={userDetails.email}
                                    type="email"
                                    placeholder="Email"
                                    className='border-[#673ab7] border px-3 py-2 rounded-md outline-none focus:border-[#34a853] text-white bg-transparent w-full'
                                    required
                                />
                                <input
                                    onChange={handleRegisterInputs}
                                    name='password'
                                    value={userDetails.password}
                                    type="password"
                                    placeholder="Password"
                                    className='border-[#673ab7] border px-3 py-2 rounded-md outline-none focus:border-[#34a853] text-white bg-transparent w-full'
                                    required
                                />
                                <input
                                    onChange={handleRegisterInputs}
                                    name='confirmPassword'
                                    value={userDetails.confirmPassword}
                                    type="password"
                                    placeholder="Confirm Password"
                                    className='border-[#673ab7] border px-3 py-2 rounded-md outline-none focus:border-[#34a853] text-white bg-transparent w-full'
                                    required
                                />
                                <button
                                    type="submit"
                                    className='bg-[#673ab7] text-white py-2 rounded-lg w-full hover:bg-[#34a853] transition duration-300 hover:scale-105'
                                >
                                    Register
                                </button>
                                <div className='text-white flex justify-center gap-x-3'>Have an account ? <Link to='/login' className='underline text-[#fbbc05]'>Login</Link></div>

                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Register;
