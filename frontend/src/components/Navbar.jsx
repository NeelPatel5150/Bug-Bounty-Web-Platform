import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const Navbar = () => {
    const { user, logout, refreshUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            refreshUser();
        }
    }, []); // Run once on mount to get fresh data

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-indigo-600">BugBounty</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-gray-700">Welcome, {user.name}</span>
                                <span className="text-green-600 font-semibold px-2">Rewards: ${user.totalRewards || 0}</span>
                                <Link to="/create-bug" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Post Bug</Link>
                                <button onClick={handleLogout} className="text-red-600 hover:text-red-900 px-3 py-2 rounded-md text-sm font-medium">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                                <Link to="/register" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
