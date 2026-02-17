import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const BugDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [bug, setBug] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [description, setDescription] = useState('');
    const [proof, setProof] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchBug = async () => {
        try {
            const { data } = await API.get(`/bugs/${id}`);
            setBug(data);
            const subData = await API.get(`/submissions/${id}`);
            setSubmissions(subData.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBug();
    }, [id]);

    const submitSolution = async (e) => {
        e.preventDefault();
        try {
            await API.post(`/submissions/${id}`, { description, proof });
            setDescription('');
            setProof('');
            fetchBug(); // Refresh
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit');
        }
    };

    const approveSubmission = async (submissionId) => {
        try {
            await API.patch(`/bugs/${id}/approve/${submissionId}`);
            fetchBug();
        } catch (error) {
            alert('Failed to approve');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!bug) return <div>Bug not found</div>;

    const isCreator = user && user._id === bug.createdBy?._id;
    const isClosed = bug.status === 'Closed';

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                    <div className="px-4 py-5 sm:px-6 flex justify-between">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">{bug.title}</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Posted by {bug.createdBy?.name}</p>
                        </div>
                        <div className="text-right">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isClosed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {bug.status}
                            </span>
                            <p className="mt-1 text-xl font-bold text-green-600">${bug.bountyAmount}</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                        <p>{bug.description}</p>
                    </div>
                </div>

                {/* Submission Form */}
                {!isCreator && !isClosed && user && (
                    <div className="bg-white shadow sm:rounded-lg mb-6 p-6">
                        <h4 className="text-lg font-medium mb-4">Submit Solution</h4>
                        <form onSubmit={submitSolution} className="space-y-4">
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your solution..."
                                className="w-full border rounded p-2"
                                required
                            />
                            <input
                                type="text"
                                value={proof}
                                onChange={(e) => setProof(e.target.value)}
                                placeholder="Proof URL (image/video)"
                                className="w-full border rounded p-2"
                                required
                            />
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Submit
                            </button>
                        </form>
                    </div>
                )}

                {/* Submissions List */}
                <div className="bg-white shadow sm:rounded-lg p-6">
                    <h4 className="text-lg font-medium mb-4">Submissions</h4>
                    {submissions.length === 0 ? (
                        <p className="text-gray-500">No submissions yet.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {submissions.map((sub) => (
                                <li key={sub._id} className="py-4">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{sub.submittedBy?.name}</p>
                                            <p className="text-sm text-gray-500">{sub.description}</p>
                                            <a href={sub.proof} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-sm">View Proof</a>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sub.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                    sub.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {sub.status}
                                            </span>
                                            {isCreator && !isClosed && sub.status === 'Pending' && (
                                                <button
                                                    onClick={() => approveSubmission(sub._id)}
                                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BugDetails;
