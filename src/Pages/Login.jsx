import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import back from '../assets/back.png';
import GlassSurface from '../components/GlassSurface';
import ApiService from '../services/apiService';


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
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetToken, setResetToken] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!email || !password || !confirmPassword || !name) {
            alert('Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            alert('Password and confirm password do not match');
            return;
        }
        
        setLoading(true);
        try {
            const response = await ApiService.register({
                name: name.trim(),
                email: email.trim(),
                password: password
            });
            
            alert('Registration successful! Please login.');
            setRegister(false);
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setName('');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Please enter email and password');
            return;
        }
        
        setLoading(true);
        try {
            const response = await ApiService.login({
                email: email.trim(),
                password: password
            });
            
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('user', JSON.stringify(response.user));
            window.location.href = '/dashboard';
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }


    const checkEmail = async () => {
        if (!email) {
            alert('Please enter email');
            return;
        }
        
        setLoading(true);
        try {
            const response = await ApiService.forgotPassword(email.trim());
            setResetToken(response.token); // Store the token for verification
            
            if (response.email_sent) {
                setOtp(true);
                alert('OTP sent to your email! Please check your inbox.');
            } else {
                // Email sending failed, show OTP for testing
                setOtp(true);
                alert(`Email sending failed. For testing purposes, your OTP is: ${response.token}`);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    const checkOTP = async () => {
        if (!OTP) {
            alert('Please enter OTP');
            return;
        }
        
        setLoading(true);
        try {
            const response = await ApiService.verifyOTP(email.trim(), OTP.trim());
            setResetToken(response.token);
            setNewpassword(true);
            alert('OTP verified successfully!');
        } catch (error) {
            alert('Invalid OTP: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const resetPassword = async () => {
        if (!password) {
            alert('Please enter new password');
            return;
        }
        
        setLoading(true);
        try {
            await ApiService.resetPassword(resetToken, password);
            alert('Password reset successfully!');
            setOtp(false);
            setNewpassword(false);
            setClicked(false);
            setEmail('');
            setPassword('');
            SetOTP('');
            setResetToken('');
        } catch (error) {
            alert('Error resetting password: ' + error.message);
        } finally {
            setLoading(false);
        }
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
                            <input type='text' value={name} placeholder='Enter your name' className='text-white rounded-xl border border-white-20 p-3 w-90 h-10 bg-transparent' onChange={(e) => setName(e.target.value)} />
                            <input type='email' value={email} placeholder='Enter your email' className='text-white rounded-xl border border-white-20 p-3 w-90 h-10 bg-transparent' onChange={(e) => setEmail(e.target.value)} />
                            <input type='password' value={password} placeholder='Enter your password' className='text-white rounded-xl border border-white-20 p-3 w-full h-10 bg-transparent' onChange={(e) => setPassword(e.target.value)} />
                            <input type='password' value={confirmPassword} placeholder='Confirm your password' className='text-white rounded-xl border border-white-20 p-3 w-full h-10 bg-transparent' onChange={(e) => setConfirmPassword(e.target.value)} />
                            <button type='submit' disabled={loading} className='bg-blue-500 w-full text-white rounded-md px-4 py-3 cursor-pointer hover:bg-blue-600 transition-colors disabled:opacity-50'>{loading ? 'Registering...' : 'Register'}</button>
                        </form>
                    )}
                    {(!clicked && !register) && (
                        <form className='flex flex-col justify-center items-center gap-6 p-6' onSubmit={handleLogin}>
                            <input type='email' value={email} placeholder='Enter your email' className='text-white rounded-xl border border-white-20 p-3 w-90 h-10 bg-transparent' onChange={(e) => setEmail(e.target.value)} />
                            <input type='password' value={password} placeholder='Enter your password' className='text-white rounded-xl border border-white-20 p-3 w-full h-10 bg-transparent' onChange={(e) => setPassword(e.target.value)} />
                            <button type='button' onClick={() => setClicked(true)} className='text-white text-sm text-underline cursor-pointer ml-60 hover:text-blue-300'>forgot password?</button>
                            <button type='submit' disabled={loading} className='bg-blue-500 w-full text-white rounded-md px-4 py-3 cursor-pointer hover:bg-blue-600 transition-colors disabled:opacity-50'>{loading ? 'Logging in...' : 'Login'}</button>
                        </form>)}
                    {(clicked && !register) && (
                        <form className='flex flex-col justify-center items-center gap-8 p-6'>
                            <h1 className='text-white text-4xl font-bold mb-4'>Reset Password</h1>
                            <input type='email' value={email} placeholder='Enter your email' className='text-white rounded-xl border border-white-20 w-90 p-3 h-10 bg-transparent' onChange={(e) => setEmail(e.target.value)} />
                            {(!otp && !newpassword) && (
                                <>
                                    <button type='button' onClick={checkEmail} disabled={loading} className='bg-blue-500 w-full text-white rounded-md px-4 py-3 cursor-pointer hover:bg-blue-600 transition-colors disabled:opacity-50'>{loading ? 'Sending...' : 'Send OTP'}</button>
                                </>)}
                            {(otp && !newpassword) && (
                                <>
                                    <input type='text' value={OTP} placeholder='Enter OTP' className='text-white rounded-xl border border-white-20 p-3 w-full h-10 bg-transparent' onChange={(e) => SetOTP(e.target.value)} />
                                    <button type='button' onClick={checkOTP} disabled={loading} className='bg-blue-500 w-full text-white rounded-md px-4 py-3 cursor-pointer hover:bg-blue-600 transition-colors disabled:opacity-50'>{loading ? 'Verifying...' : 'Submit OTP'}</button></>)}
                            {(otp && newpassword) && (
                                <>
                                    <input type='password' value={password} placeholder='Enter your new password' className='text-white rounded-xl border border-white-20 p-3 w-full h-10 bg-transparent' onChange={(e) => setPassword(e.target.value)} />
                                    <button type='button' onClick={resetPassword} disabled={loading} className='bg-blue-500 w-full text-white rounded-md px-4 py-3 cursor-pointer hover:bg-blue-600 transition-colors disabled:opacity-50'>{loading ? 'Resetting...' : 'Reset'}</button> </>)}

                        </form>
                    )}
                </div>
            </GlassSurface>
        </div>
    );
}

export default Login;
