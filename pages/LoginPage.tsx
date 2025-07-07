import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { signInWithPassword } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/admin/dashboard';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const { error: authError } = await signInWithPassword(email, password);
        
        if (authError) {
            setError(authError.message);
        } else {
            navigate(from, { replace: true });
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-f1-light-dark p-10 rounded-xl shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white uppercase">
                        Admin <span className="text-f1-red">Login</span>
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="relative block w-full appearance-none rounded-none rounded-t-md border-2 border-f1-gray bg-f1-dark px-3 py-3 text-white placeholder-gray-500 focus:z-10 focus:border-f1-red focus:outline-none focus:ring-f1-red sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="relative block w-full appearance-none rounded-none rounded-b-md border-2 border-f1-gray bg-f1-dark px-3 py-3 text-white placeholder-gray-500 focus:z-10 focus:border-f1-red focus:outline-none focus:ring-f1-red sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-f1-red text-center bg-red-900/50 p-2 rounded-md">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-f1-red py-3 px-4 text-base font-bold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-f1-dark disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
