import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { NeoCard, NeoInput, NeoButton, NeoBadge } from '../components/NeoBrutalist';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            navigate('/');
        } catch (error) {
            alert('Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(#f0f0f0_1px,transparent_1px),linear-gradient(90deg,#f0f0f0_1px,transparent_1px)] bg-[size:20px_20px] -z-10"></div>

            <NeoCard className="max-w-md w-full relative z-10 border-4 shadow-[8px_8px_0_#000]">
                {/* Floating Badge */}
                <div className="absolute -top-6 -left-6 -rotate-6">
                    <NeoBadge className="bg-yellow-400 text-black text-lg py-2">
                        JOIN THE ELITE
                    </NeoBadge>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">
                        Create Account
                    </h2>
                    <p className="font-medium text-gray-500 border-b-2 border-black inline-block pb-1">
                        Start your bug bounty journey today
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block font-bold uppercase text-sm mb-1 ml-1">Full Name</label>
                            <NeoInput
                                type="text"
                                required
                                placeholder="Neo Anderson"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block font-bold uppercase text-sm mb-1 ml-1">Email Address</label>
                            <NeoInput
                                type="email"
                                required
                                placeholder="hunter@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block font-bold uppercase text-sm mb-1 ml-1">Password</label>
                            <NeoInput
                                type="password"
                                required
                                placeholder="Must be strong..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <NeoButton
                        type="submit"
                        className="w-full text-lg py-4 bg-[#d4561c] text-white hover:bg-[#b04010]"
                    >
                        Register Now
                    </NeoButton>
                </form>

                <div className="text-center mt-6 pt-6 border-t-2 border-dashed border-gray-300">
                    <Link to="/login" className="font-bold hover:text-[#d4561c] hover:underline uppercase text-sm">
                        Already have an account? Login
                    </Link>
                </div>
            </NeoCard>
        </div>
    );
};

export default Register;
