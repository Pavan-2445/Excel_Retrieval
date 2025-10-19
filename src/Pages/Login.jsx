import React, { useEffect, useState } from 'react';
import Particles from '../components/Particles';
import GlassSurface from '../components/GlassSurface';
import back from '../assets/back.png'
import db from '../assets/Dummydata.json';
import { useNavigate } from 'react-router-dom';


function Login() {

    const navigate = useNavigate();
    useEffect(() => {
        if(localStorage.getItem('loggedIn')){
            navigate('/dashboard');
        }
    },[])

    const [clicked, setClicked] = useState(false);
    const [otp, setOtp] = useState(false);
    const [newpassword, setNewpassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [OTP , SetOTP] = useState('');

    const handleLogin = (e) => {
    e.preventDefault();
    if(!email || !password) {
        alert('Please enter email and password');
        return;
    }
    const user = db.Users.find((user) => user.Email === email && user.Password === password);
    if(!user){
        alert('Invalid email or password');
        return;
    }else{
        localStorage.setItem('loggedIn' , 'true');
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = '/dashboard';
    }
}


    const checkEmail = () => {
        if(!email){
            alert('Please enter email');
            return;
        }
        const user = db.Users.find((user) => user.Email === email);
        if(!user){
            alert('Invalid email');
            return;
        }
        setOtp(true);
    }

    const checkOTP = () => {
        if(!OTP){
            alert('Please enter OTP');
            return;
        }
        //logic for the OTP verification
        setNewpassword(true);
    }

    const resetPassword = () => {

        if(!password){
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
        if(!otp && !newpassword){
            setClicked(false);
        }else if(otp && !newpassword){
            setOtp(false);
            SetOTP('');
        }else if(otp && newpassword){
            setNewpassword(false);
            setPassword('');
            SetOTP('');
        }
    }

    

    return (
            <div className='flex flex-row justify-center items-center absolute inset-0'>
                <GlassSurface
                    width={400}
                    height={500}
                    borderRadius={24}
                    className="my-custom-class"
                >
                    {!clicked ?
                        <form className='flex flex-col justify-between  items-center gap-10' onSubmit={handleLogin}>
                            <h1 className='text-white text-5xl font-bold'>LOGIN</h1>
                            <input type='email' value={email} placeholder='Enter your email' className='text-white rounded-xl border border-white-20 p-2 w-85 h-8' onChange={(e) => setEmail(e.target.value)}/>
                            <input type='password' value={password} placeholder='Enter your password' className='text-white rounded-xl border border-white-20 p-2 w-85 h-8' onChange={(e) => setPassword(e.target.value)}/>
                            <button type='button' onClick={() => setClicked(true)} className='text-white ml-50 text-underline cursor-pointer'>forgot password?</button>
                            <button type='submit' className='bg-blue-400 w-35 text-white rounded-md px-4 py-2 cursor-pointer'>Login</button>
                        </form> :
                        <form className='flex flex-col justify-between  items-center gap-10'>
                                <h1 className='text-white text-5xl font-bold'>Reset Password</h1>
                                <button type='button' onClick={handleBack} className='flex flex-row items-center text-white ml-70 gap-2 text-underline cursor-pointer'><img src={back} alt='backlogo'  className='w-4 h-4 '/> Back</button>
                                <input type='email' value={email} placeholder='Enter your email' className='text-white rounded-xl border border-white-20 p-2 w-85 h-8' onChange={(e) => setEmail(e.target.value)}/>
                            {(!otp && !newpassword) &&(
                                <>
                                    <button type='button' onClick = {checkEmail} className='bg-blue-400 w-35 text-white rounded-md px-4 py-2 cursor-pointer'>Send OTP</button>
                                </>)}
                            {(otp && !newpassword) &&(
                                <>
                                <input type='text' value={OTP} placeholder='Enter OTP'  className='text-white rounded-xl border border-white-20 p-2 w-85 h-8' onChange={(e) => SetOTP(e.target.value)}/>
                                <button type='button' onClick={checkOTP} className='bg-blue-400 w-35 text-white rounded-md px-4 py-2 cursor-pointer'>Submit OTP</button></>)}
                            {(otp && newpassword) &&(
                                <>
                                    <input type='password' value={password} placeholder='Enter your new password' className='text-white rounded-xl border border-white-20 p-2 w-85 h-8' onChange={(e) => setPassword(e.target.value)}/>
                                    <button type='button' onClick={resetPassword} className='bg-blue-400 w-35 text-white rounded-md px-4 py-2 cursor-pointer'>Reset</button> </>)}

                        </form>
                    }
                </GlassSurface>
            </div>
    );
}

export default Login;