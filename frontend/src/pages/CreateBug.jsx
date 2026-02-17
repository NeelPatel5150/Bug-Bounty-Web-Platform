import { useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { NeoCard, NeoInput, NeoButton, NeoBadge } from '../components/NeoBrutalist';

const CreateBug = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [bountyAmount, setBountyAmount] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/bugs', { title, description, bountyAmount });
            navigate('/');
        } catch (error) {
            alert('Failed to create bug');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-3xl mx-auto py-12 px-4 relative">
                {/* Decorative Elements */}
                <div className="absolute top-10 right-0 w-20 h-20 bg-yellow-400 border-2 border-black rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-10 left-0 w-20 h-20 bg-[#d4561c] border-2 border-black rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

                <NeoCard className="relative z-10 border-4 shadow-[8px_8px_0_#000]">
                    <div className="border-b-2 border-black pb-6 mb-8 flex justify-between items-center">
                        <h2 className="text-3xl font-black uppercase tracking-tighter">
                            Post New Bounty
                        </h2>
                        <NeoBadge className="bg-black text-white rotate-2">
                            GET HELP
                        </NeoBadge>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block font-bold uppercase text-sm mb-2 ml-1">Bug Title</label>
                            <NeoInput
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Broken Login on Mobile"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-bold uppercase text-sm mb-2 ml-1">Detailed Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows="6"
                                placeholder="Describe reproduction steps and impact..."
                                className="w-full border-2 border-black bg-white p-4 text-black shadow-[4px_4px_0_#000] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all placeholder:text-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block font-bold uppercase text-sm mb-2 ml-1">Bounty Amount ($)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                    <span className="text-black font-bold">$</span>
                                </div>
                                <NeoInput
                                    type="number"
                                    value={bountyAmount}
                                    onChange={(e) => setBountyAmount(e.target.value)}
                                    required
                                    min="1"
                                    className="pl-8"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t-2 border-dashed border-gray-300">
                            <NeoButton
                                type="submit"
                                className="w-full text-lg py-4 bg-[#d4561c] text-white hover:bg-[#b04010]"
                            >
                                Launch Bug Bounty
                            </NeoButton>
                        </div>
                    </form>
                </NeoCard>
            </div>
        </div>
    );
};

export default CreateBug;
