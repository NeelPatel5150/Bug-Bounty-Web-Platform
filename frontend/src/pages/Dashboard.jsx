import { useEffect, useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { NeoCard, NeoBadge, NeoButton, NeoSecondaryButton } from '../components/NeoBrutalist';

const Dashboard = () => {
    const [bugs, setBugs] = useState([]);

    useEffect(() => {
        const fetchBugs = async () => {
            try {
                const { data } = await API.get('/bugs');
                setBugs(data);
            } catch (error) {
                console.error("Failed to fetch bugs", error);
            }
        };
        fetchBugs();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <div className="border-b-2 border-black bg-white pb-16 pt-12 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:30px_30px] -z-10"></div>

                <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                    <NeoBadge className="mb-6 bg-yellow-400">
                        BUG BOUNTY PROGRAM
                    </NeoBadge>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
                        Find Bugs. <span className="bg-black text-white px-2 transform -rotate-1 inline-block">Get Paid.</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl font-medium border-l-4 border-[#d4561c] pl-4 text-left md:text-center md:border-l-0 md:pl-0">
                        Help secure the web by finding vulnerabilities. Earn massive bounties for your skills.
                    </p>
                </div>
            </div>

            {/* Bugs Grid */}
            <div className="max-w-7xl mx-auto px-4 -mt-8 mb-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bugs.map((bug) => (
                        <NeoCard key={bug._id} className="hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <NeoBadge rotate="rotate-0" className={`${bug.status === 'Open' ? 'bg-green-400' : 'bg-red-400'} text-xs`}>
                                    {bug.status}
                                </NeoBadge>
                                <span className="text-lg font-black bg-black text-white px-3 py-1 transform rotate-2 shadow-[2px_2px_0_#d4561c]">
                                    ${bug.bountyAmount}
                                </span>
                            </div>

                            <h3 className="text-2xl font-black uppercase mb-3 line-clamp-2 leading-tight">
                                <Link to={`/bug/${bug._id}`} className="hover:underline decoration-4 decoration-[#d4561c]">
                                    {bug.title}
                                </Link>
                            </h3>

                            <p className="font-medium text-gray-700 line-clamp-3 mb-6 flex-grow border-l-2 border-gray-300 pl-3">
                                {bug.description}
                            </p>

                            <div className="pt-4 border-t-2 border-black flex justify-between items-center mt-auto">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold border-2 border-black rounded-sm">
                                        {bug.createdBy?.name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="text-xs font-bold uppercase truncate max-w-[100px]">
                                        {bug.createdBy?.name}
                                    </span>
                                </div>
                                <Link to={`/bug/${bug._id}`}>
                                    <NeoSecondaryButton className="py-2 px-3 text-xs bg-white text-black hover:bg-gray-100">
                                        View Details -&gt;
                                    </NeoSecondaryButton>
                                </Link>
                            </div>
                        </NeoCard>
                    ))}
                </div>
                {bugs.length === 0 && (
                    <div className="text-center py-20">
                        <NeoCard className="inline-block">
                            <h3 className="text-xl font-bold uppercase">No Bugs Found</h3>
                            <p className="mt-2">Check back later for new bounties!</p>
                        </NeoCard>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
