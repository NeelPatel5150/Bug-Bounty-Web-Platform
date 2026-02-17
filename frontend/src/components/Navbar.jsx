import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { NeoButton, NeoBadge } from './NeoBrutalist';

const Navbar = () => {
    const { user, logout, refreshUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            refreshUser();
        }
    }, [user, refreshUser]); // Added dependencies to fix lint warning

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="border-b-2 border-black py-4 sticky top-0 bg-white z-50">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center">
                    <Link to="/" className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2 group">
                        <span className="bg-black text-white px-2 py-1 transform -rotate-2 group-hover:rotate-0 transition-transform duration-200">BUG</span>
                        <span className="group-hover:text-[#d4561c] transition-colors">BOUNTY</span>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <div className="hidden md:flex flex-col items-end mr-2">
                                <span className="text-black font-bold uppercase text-sm">{user.name}</span>
                                <span className="text-[#d4561c] font-black text-xs">
                                    <span className="bg-black text-white px-1 mr-1">$</span>
                                    {user.totalRewards || 0}
                                </span>
                            </div>
                            <Link to="/profile" className="font-bold border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-colors uppercase text-sm shadow-[2px_2px_0_#000]">
                                Profile
                            </Link>
                            <Link to="/create-bug">
                                <NeoButton className="py-2 px-4 text-sm hidden md:block bg-[#d4561c]">
                                    + Post Bug
                                </NeoButton>
                            </Link>
                            <button onClick={handleLogout} className="font-bold border-2 border-black px-3 py-1 bg-red-500 text-white hover:translate-x-[2px] hover:translate-y-[2px] transition-all shadow-[2px_2px_0_#000] uppercase text-sm">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="font-bold hover:underline uppercase">Login</Link>
                            <Link to="/register">
                                <NeoButton className="py-2 px-4 text-sm">
                                    Sign Up
                                </NeoButton>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
