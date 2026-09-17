import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Email and password are required');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Logged in successfully');
                login(data.data);
                navigate('/profile');
            } else {
                toast.error(data.message || 'Login failed');
            }
        } catch (error) {
            toast.error('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <span className="font-serif italic text-gold text-sm">Welcome back</span>
                    <h1 className="font-serif text-3xl text-parchment mt-2">Log in to MastersGang</h1>
                    <p className="text-mist text-sm mt-3">Pick up where you left off — your classes are waiting.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-gradient-to-b from-panel2 to-panel border border-parchment/10 rounded-md p-8 space-y-5">
                    <div>
                        <label className="text-mistdim text-xs block mb-2">Email</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mistdim" />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-ink border border-parchment/15 rounded pl-10 pr-3 py-3 text-[14.5px] text-parchment placeholder:text-mistdim outline-none focus:border-brand transition-colors"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-parchment text-ink font-semibold py-3 rounded hover:bg-gold transition-colors disabled:opacity-60"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {loading ? 'Logging in…' : 'Log in'}
                    </button>
                </form>

                <p className="text-center text-mist text-sm mt-6">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-gold hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
