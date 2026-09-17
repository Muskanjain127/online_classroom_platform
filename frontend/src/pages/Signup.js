import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { User, Mail, Lock, KeyRound, Loader2, GraduationCap, BookOpen } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password || !otp) {
            toast.error('All fields are required');
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, otp, role }),
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Registration successful');
                login(data.data);
                navigate('/profile');
            } else {
                toast.error(data.message || 'Registration failed');
            }
        } catch (error) {
            toast.error('Error during registration');
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async () => {
        if (!email) {
            toast.error('Please enter your email first');
            return;
        }
        try {
            setOtpLoading(true);
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/sendotp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('OTP sent to your email');
                setOtpSent(true);
            } else {
                toast.error(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            toast.error('Error sending OTP');
        } finally {
            setOtpLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <span className="font-serif italic text-gold text-sm">Join in a minute</span>
                    <h1 className="font-serif text-3xl text-parchment mt-2">Create your account</h1>
                    <p className="text-mist text-sm mt-3">A verified email keeps every classroom's roll honest.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-gradient-to-b from-panel2 to-panel border border-parchment/10 rounded-md p-8 space-y-5">
                    <div>
                        <label className="text-mistdim text-xs block mb-2">Full name</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mistdim" />
                            <input
                                type="text"
                                placeholder="Muskan Jain"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full bg-ink border border-parchment/15 rounded pl-10 pr-3 py-3 text-[14.5px] text-parchment placeholder:text-mistdim outline-none focus:border-brand transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-mistdim text-xs block mb-2">Email</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mistdim" />
                                <input
                                    type="email"
                                    placeholder="muskan@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-ink border border-parchment/15 rounded pl-10 pr-3 py-3 text-[14.5px] text-parchment placeholder:text-mistdim outline-none focus:border-brand transition-colors"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={otpLoading}
                                className="whitespace-nowrap text-sm border border-parchment/20 px-4 rounded hover:border-gold hover:text-gold transition-colors disabled:opacity-60"
                            >
                                {otpLoading ? '…' : otpSent ? 'Resend' : 'Send OTP'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-mistdim text-xs block mb-2">One-time code</label>
                        <div className="relative">
                            <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mistdim" />
                            <input
                                type="text"
                                placeholder="6-digit code from your email"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="w-full bg-ink border border-parchment/15 rounded pl-10 pr-3 py-3 text-[14.5px] text-parchment placeholder:text-mistdim outline-none focus:border-brand transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-mistdim text-xs block mb-2">Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mistdim" />
                            <input
                                type="password"
                                placeholder="At least 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-ink border border-parchment/15 rounded pl-10 pr-3 py-3 text-[14.5px] text-parchment placeholder:text-mistdim outline-none focus:border-brand transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-mistdim text-xs block mb-2">I am joining as a</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setRole('student')}
                                className={`flex items-center justify-center gap-2 py-3 rounded border text-sm transition-colors ${
                                    role === 'student'
                                        ? 'border-brand bg-brand/10 text-parchment'
                                        : 'border-parchment/15 text-mist hover:border-parchment/30'
                                }`}
                            >
                                <GraduationCap size={16} /> Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('teacher')}
                                className={`flex items-center justify-center gap-2 py-3 rounded border text-sm transition-colors ${
                                    role === 'teacher'
                                        ? 'border-brand bg-brand/10 text-parchment'
                                        : 'border-parchment/15 text-mist hover:border-parchment/30'
                                }`}
                            >
                                <BookOpen size={16} /> Teacher
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-parchment text-ink font-semibold py-3 rounded hover:bg-gold transition-colors disabled:opacity-60"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {loading ? 'Creating account…' : 'Create account'}
                    </button>
                </form>

                <p className="text-center text-mist text-sm mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-gold hover:underline">Log in here</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
