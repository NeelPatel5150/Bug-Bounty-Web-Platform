import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import Navbar from '../components/Navbar';

const Profile = () => {
    const { user } = useAuth();
    const [myBugs, setMyBugs] = useState([]);

    useEffect(() => {
        const fetchMyBugs = async () => {
            if (user) {
                // Ideally backend should filter, but for now filtering on frontend or adding endpoint
                // Let's rely on standard list for now and filter here or use a new endpoint if strict.
                // But efficient way: GET /api/bugs?creator=ID
                // For now, I'll just fetch all bugs and filter (not optimal but quick) or add endpoint.
                // Better: Add endpoint to backend?
                // Or just filter.
                const { data } = await API.get('/bugs');
                const userBugs = data.filter(bug => bug.createdBy._id === user._id);
                setMyBugs(userBugs);
            }
        };
        fetchMyBugs();
    }, [user]);

    if (!user) return <div>Please login</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Total Rewards</dt>
                                <dd className="mt-1 text-sm text-green-600 font-bold sm:mt-0 sm:col-span-2">${user.totalRewards}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <h3 className="text-lg font-medium mb-4">My Posted Bugs</h3>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {myBugs.map((bug) => (
                            <li key={bug._id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-indigo-600 truncate">{bug.title}</p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bug.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {bug.status}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                Bounty: ${bug.bountyAmount}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Profile;
