import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfilePage from './pages/ProfilePage';
import ClassesDetails from './pages/ClassesDetails';
import NotFound from './pages/NotFound';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { auth, login } = useAuth();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/checklogin`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();

                if (response.ok && data.ok) {
                    login({ userId: data.userId });
                } else {
                    navigate('/login');
                }
            } catch (error) {
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        checkLoginStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-mist">
                <div className="w-8 h-8 border-2 border-parchment/20 border-t-brand rounded-full animate-spin" />
                <p className="text-sm">Checking your session…</p>
            </div>
        );
    }

    return auth.user ? children : <Navigate to="/login" />;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/classes/:classid"
                        element={
                            <ProtectedRoute>
                                <ClassesDetails />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <ToastContainer theme="dark" position="bottom-right" />
            </Router>
        </AuthProvider>
    );
};

export default App;
