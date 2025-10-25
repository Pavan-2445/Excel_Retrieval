import React, { useEffect, useState } from 'react';
import GlassSurface from '../components/GlassSurface';
import back from '../assets/back.png'
import db from '../assets/Dummydata.json';
import { useNavigate } from 'react-router-dom';


function Login() {

    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('loggedIn')) {
            navigate('/dashboard');
        }
    }, [])

    const [clicked, setClicked] = useState(false);
    const [register, setRegister] = useState(false);
    const [otp, setOtp] = useState(false);
    const [newpassword, setNewpassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [OTP, SetOTP] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        if (!email || !password || !confirmPassword) {
            alert('Please enter email and password');
            return;
        }
        if (password !== confirmPassword) {
            alert('Password and confirm password do not match');
            return;
        }
        //Add the backend for inserting new user
        setRegister(false);
    }

    const handleLogin = (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Please enter email and password');
            return;
        }
        const user = db.Users.find((user) => user.Email === email && user.Password === password);
        if (!user) {
            alert('Invalid email or password');
            return;
        } else {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = '/dashboard';
        }
    }


    const checkEmail = () => {
        if (!email) {
            alert('Please enter email');
            return;
        }
        const user = db.Users.find((user) => user.Email === email);
        if (!user) {
            alert('Invalid email');
            return;
        }
        setOtp(true);
    }

    const checkOTP = () => {
        if (!OTP) {
            alert('Please enter OTP');
            return;
        }
        //logic for the OTP verification
        setNewpassword(true);
    }

    const resetPassword = () => {

        if (!password) {
            alert('Please enter new password');
            return;
        }

        setOtp(false);
        setNewpassword(false);
        setClicked(false);
        //logic for updations in backend for new password 
        setEmail('');
        setPassword('');
        SetOTP('');
    }

    const handleBack = () => {
        if (!otp && !newpassword) {
            setClicked(false);
        } else if (otp && !newpassword) {
            setOtp(false);
            SetOTP('');
        } else if (otp && newpassword) {
            setNewpassword(false);
            setPassword('');
            SetOTP('');
        }
    }



    return (
        <div className='flex justify-center items-center min-h-screen px-4'>
            <GlassSurface
                width={600}
                height={500}
                borderRadius={24}
                className="my-custom-class"
            >
                <div className='flex flex-col justify-center items-center gap-6 p-6'>
                    <div className='flex items-center gap-15 pb-4'>
                        {clicked && !register && (
                            <img
                                src={back}
                                onClick={handleBack}
                                alt="backlogo"
                                className="w-7 h-6 inline-block -ml-21 cursor-pointer"
                            />
                        )}
                        <button
                            type="button"
                            onClick={() => setRegister(false)}
                            className={`text-4xl font-bold cursor-pointer ${(!clicked && !register) || (clicked && !register)
                                    ? 'text-black rounded-xl w-30 h-12 bg-white'
                                    : 'text-white'
                                }`}
                        >

                            Login
                        </button>

                        <div className="border-l border-white h-10"></div>
                        <button type='button' onClick={() => { setRegister(true), setEmail(""), setPassword("") }} className={`text-4xl font-bold cursor-pointer ${!clicked && register || clicked && register
                            ? 'text-black text-4xl rounded-xl  w-34 h-12 bg-white'
                            : 'text-white'
                            }`}
                        >Signup</button>
                    </div>
                    {(!clicked && register || clicked && register) && (
                        <form className='flex flex-col gap-8' onSubmit={handleRegister}>
                            <input type='email' value={email} placeholder='Enter your email' className='text-white rounded-xl border border-white-20 p-3 w-90 h-10 bg-transparent' onChange={(e) => setEmail(e.target.value)} />
                            <input type='password' value={password} placeholder='Enter your password' className='text-white rounded-xl border border-white-20 p-3 w-full h-10 bg-transparent' onChange={(e) => setPassword(e.target.value)} />
                            <input type='password' value={confirmPassword} placeholder='Confirm your password' className='text-white rounded-xl border border-white-20 p-3 w-full h-10 bg-transparent' onChange={(e) => setConfirmPassword(e.target.value)} />
                            <button type='submit' className='bg-blue-500 w-full text-white rounded-md px-4 py-3 cursor-pointer hover:bg-blue-600 transition-colors'>Register</button>
                        </form>
                    )}
                    {(!clicked && !register) && (
                        <form className='flex flex-col justify-center items-center gap-6 p-6' onSubmit={handleLogin}>
                            <input type='email' value={email} placeholder='Enter your email' className='text-white rounded-xl border border-white-20 p-3 w-90 h-10 bg-transparent' onChange={(e) => setEmail(e.target.value)} />
                            <input type='password' value={password} placeholder='Enter your password' className='text-white rounded-xl border border-white-20 p-3 w-full h-10 bg-transparent' onChange={(e) => setPassword(e.target.value)} />
                            <button type='button' onClick={() => setClicked(true)} className='text-white text-sm text-underline cursor-pointer ml-60 hover:text-blue-300'>forgot password?</button>
                            <button type='submit' className='bg-blue-500 w-full text-white rounded-md px-4 py-3 cursor-pointer hover:bg-blue-600 transition-colors'>Login</button>
                        </form>)}
                    {(clicked && !register) && (
                        <form className='flex flex-col justify-center items-center gap-8 p-6'>
                            <h1 className='text-white text-4xl font-bold mb-4'>Reset Password</h1>
                            <input type='email' value={email} placeholder='Enter your email' className='text-white rounded-xl border border-white-20 w-90 p-3 h-10 bg-transparent' onChange={(e) => setEmail(e.target.value)} />
                            {(!otp && !newpassword) && (
                                <>
                                    <button type='button' onClick={checkEmail} className='bg-blue-500 w-full text-white rounded-md px-4 py-3 cursor-pointer hover:bg-blue-600 transition-colors'>Send OTP</button>
                                </>)}
                            {(otp && !newpassword) && (
                                <>
                                    <input type='text' value={OTP} placeholder='Enter OTP' className='text-white rounded-xl border border-white-20 p-3 w-full h-10 bg-transparent' onChange={(e) => SetOTP(e.target.value)} />
                                    <button type='button' onClick={checkOTP} className='bg-blue-500 w-full text-white rounded-md px-4 py-3 cursor-pointer hover:bg-blue-600 transition-colors'>Submit OTP</button></>)}
                            {(otp && newpassword) && (
                                <>
                                    <input type='password' value={password} placeholder='Enter your new password' className='text-white rounded-xl border border-white-20 p-3 w-full h-10 bg-transparent' onChange={(e) => setPassword(e.target.value)} />
                                    <button type='button' onClick={resetPassword} className='bg-blue-500 w-full text-white rounded-md px-4 py-3 cursor-pointer hover:bg-blue-600 transition-colors'>Reset</button> </>)}

                        </form>
                    )}
                </div>
            </GlassSurface>
        </div>
    );
}

export default Login;