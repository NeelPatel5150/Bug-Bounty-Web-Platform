import { useEffect, useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [bugs, setBugs] = useState([]);

    useEffect(() => {
        const fetchBugs = async () => {
            const { data } = await API.get('/bugs');
            setBugs(data);
        };
        fetchBugs();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Open Bounties</h1>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {bugs.map((bug) => (
                        <div key={bug._id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bug.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {bug.status}
                                    </span>
                                    <span className="text-sm text-gray-500">${bug.bountyAmount}</span>
                                </div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900 truncate">
                                    <Link to={`/bug/${bug._id}`} className="hover:underline">{bug.title}</Link>
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 truncate">{bug.description}</p>
                                <div className="mt-4">
                                    <Link to={`/bug/${bug._id}`} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                                        View Details &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
