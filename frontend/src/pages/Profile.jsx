import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { NeoCard, NeoBadge } from '../components/NeoBrutalist';
import API from '../services/api';

const Profile = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalEarned: 0,
        bugsFixed: 0,
        submissions: []
    });

    useEffect(() => {
        // Mock fetch or real fetch if endpoint exists
        // simplified for now as creating new file
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-4xl mx-auto py-12 px-4">
                <NeoCard className="mb-8 border-4 shadow-[8px_8px_0_#000]">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-black text-white flex items-center justify-center text-4xl font-black border-4 border-black">
                            {user?.name?.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter">{user?.name}</h1>
                            <p className="font-bold text-gray-500 uppercase">{user?.email}</p>
                            <NeoBadge className="mt-2 bg-[#d4561c] text-white">
                                ELITE HUNTER
                            </NeoBadge>
                        </div>
                    </div>
                </NeoCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <NeoCard className="bg-black text-white">
                        <h3 className="text-xl font-bold uppercase text-gray-400">Total Bounties Earned</h3>
                        <div className="text-5xl font-black mt-2 text-[#d4561c]">$ {user?.totalRewards || 0}</div>
                    </NeoCard>
                    <NeoCard>
                        <h3 className="text-xl font-bold uppercase text-gray-500">Hunter ID</h3>
                        <div className="text-lg font-black mt-2 truncate">{user?._id}</div>
                    </NeoCard>
                </div>
            </div>
        </div>
    );
};

export default Profile;
