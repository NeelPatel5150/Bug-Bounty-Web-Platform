import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { NeoCard, NeoBadge, NeoButton, NeoInput } from '../components/NeoBrutalist';

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
            fetchBug();
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

    if (loading) return <div className="flex justify-center items-center h-screen bg-white font-black text-2xl uppercase">Loading...</div>;
    if (!bug) return <div>Bug not found</div>;

    const isCreator = user && user._id === bug.createdBy?._id;
    const isClosed = bug.status === 'Closed';

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-7xl mx-auto py-12 px-4">

                {/* Header Card */}
                <NeoCard className="mb-12 border-4 shadow-[8px_8px_0_#000]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-2 border-black pb-8">
                        <div>
                            <div className="flex flex-wrap items-center gap-4 mb-2">
                                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">{bug.title}</h1>
                                <NeoBadge className={`${isClosed ? 'bg-red-500 text-white' : 'bg-green-400 text-black'} text-sm`}>
                                    {bug.status}
                                </NeoBadge>
                            </div>
                            <p className="font-bold text-gray-500 uppercase text-sm">Posted by {bug.createdBy?.name}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-black uppercase mb-1">Bounty Reward</div>
                            <div className="text-5xl font-black text-[#d4561c] bg-black px-4 py-1 transform -rotate-1 shadow-[4px_4px_0_#d4561c] text-white">
                                ${bug.bountyAmount}
                            </div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <h3 className="text-xl font-black uppercase mb-4 border-l-4 border-black pl-3">Description</h3>
                        <div className="prose prose-lg max-w-none font-medium text-gray-800 bg-gray-50 p-6 border-2 border-black shadow-[4px_4px_0_#000]">
                            {bug.description}
                        </div>
                    </div>
                </NeoCard>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Submissions List */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between border-b-2 border-black pb-2">
                            <h2 className="text-3xl font-black uppercase">Submissions ({submissions.length})</h2>
                        </div>
                        {submissions.length === 0 ? (
                            <NeoCard className="text-center py-12 bg-gray-50 border-dashed">
                                <p className="font-bold text-gray-500 uppercase">No submissions yet.</p>
                                <p className="text-sm">Be the first to claim the bounty!</p>
                            </NeoCard>
                        ) : (
                            <div className="space-y-6">
                                {submissions.map((sub) => (
                                    <NeoCard key={sub._id} className={`transition-all ${sub.status === 'Approved' ? 'border-[#d4561c] shadow-[6px_6px_0_#d4561c]' : ''}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-black text-white flex items-center justify-center font-bold border-2 border-black text-lg">
                                                    {sub.submittedBy?.name?.charAt(0)}
                                                </div>
                                                <span className="font-bold text-lg uppercase">{sub.submittedBy?.name}</span>
                                            </div>
                                            <NeoBadge className={`text-xs ${sub.status === 'Approved' ? 'bg-green-400' : sub.status === 'Rejected' ? 'bg-red-400 text-white' : 'bg-yellow-400'}`}>
                                                {sub.status}
                                            </NeoBadge>
                                        </div>

                                        <p className="font-medium text-gray-700 mb-4 bg-gray-100 p-4 border-2 border-gray-200">
                                            {sub.description}
                                        </p>

                                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t-2 border-gray-200 pt-4">
                                            <a href={sub.proof} target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-[#d4561c] uppercase text-sm">
                                                View Proof Attachment
                                            </a>
                                            {isCreator && !isClosed && sub.status === 'Pending' && (
                                                <NeoButton
                                                    onClick={() => approveSubmission(sub._id)}
                                                    className="bg-green-500 text-black py-2 px-4"
                                                >
                                                    Approve & Award
                                                </NeoButton>
                                            )}
                                        </div>
                                    </NeoCard>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submission Form */}
                    <div>
                        {!isCreator && !isClosed && user ? (
                            <div className="sticky top-24">
                                <NeoCard className="border-4 shadow-[8px_8px_0_#d4561c]">
                                    <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
                                        <span className="bg-black text-white px-2">Submit</span> Solution
                                    </h2>
                                    <form onSubmit={submitSolution} className="space-y-6">
                                        <div>
                                            <label className="block font-bold uppercase text-sm mb-2 ml-1">Details</label>
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Explain how you fixed the bug..."
                                                className="w-full border-2 border-black bg-white p-4 text-black shadow-[4px_4px_0_#000] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all placeholder:text-gray-500 h-32"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-bold uppercase text-sm mb-2 ml-1">Proof URL</label>
                                            <NeoInput
                                                type="text"
                                                value={proof}
                                                onChange={(e) => setProof(e.target.value)}
                                                placeholder="https://github.com/..."
                                                required
                                            />
                                        </div>
                                        <NeoButton type="submit" className="w-full bg-black text-white hover:bg-gray-800 py-4 text-lg">
                                            Submit Solution
                                        </NeoButton>
                                    </form>
                                </NeoCard>
                            </div>
                        ) : isCreator ? (
                            <NeoCard className="bg-[#d4561c] text-white border-black">
                                <h3 className="text-xl font-black uppercase">Creator Mode</h3>
                                <p className="font-medium mt-2">Review submissions and approve the best one to award the bounty.</p>
                            </NeoCard>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BugDetails;
