import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SearchPopup from './SearchPopup';

const Navbar = () => {
    const { auth, logout } = useAuth();
    const [showPopup, setShowPopup] = useState(false);

    return (
        <nav className="sticky top-0 z-40 flex items-center justify-between px-6 sm:px-10 py-4 bg-ink/90 backdrop-blur border-b border-parchment/10">
            <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-2 font-serif text-xl text-parchment">
                    <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_0_3px_rgba(200,164,94,0.18)]" />
                    MastersGang(Online Classroom Platform)
                </Link>
                <button
                    onClick={() => setShowPopup(true)}
                    aria-label="Search classrooms"
                    className="w-8 h-8 flex items-center justify-center rounded border border-parchment/15 text-mist hover:text-gold hover:border-gold transition-colors"
                >
                    <Search size={16} strokeWidth={1.6} />
                </button>
                {showPopup && <SearchPopup onClose={() => setShowPopup(false)} />}
            </div>

            <div className="flex items-center gap-5">
                {auth.user ? (
                    <>
                        <Link to="/profile" className="text-sm text-mist hover:text-parchment transition-colors">
                            Profile
                        </Link>
                        <button
                            onClick={logout}
                            className="text-sm border border-parchment/25 px-4 py-2 rounded hover:border-gold hover:text-gold transition-colors"
                        >
                            Log out
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-sm text-mist hover:text-parchment transition-colors">
                            Log in
                        </Link>
                        <Link
                            to="/signup"
                            className="text-sm font-semibold bg-parchment text-ink px-4 py-2 rounded hover:bg-gold transition-colors"
                        >
                            Get started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
