
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { VideoIcon } from '../../components/icons/VideoIcon';
import { DocumentTextIcon } from '../../components/icons/DocumentTextIcon';
import { getSupabaseErrorMessage } from '../../lib/errorHelper';

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState<{ replays: number; articles: number }>({ replays: 0, articles: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                const [replaysCount, articlesCount] = await Promise.all([
                    supabase.from('replays').select('*', { count: 'exact', head: true }),
                    supabase.from('articles').select('*', { count: 'exact', head: true })
                ]);

                if(replaysCount.error) throw replaysCount.error;
                if(articlesCount.error) throw articlesCount.error;

                setStats({
                    replays: replaysCount.count ?? 0,
                    articles: articlesCount.count ?? 0
                });
            } catch (err) {
                setError(getSupabaseErrorMessage(err, "fetching dashboard stats"));
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const StatCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: number }) => (
        <div className="bg-f1-gray p-6 rounded-lg flex items-center gap-6">
            <div className="text-f1-red">{icon}</div>
            <div>
                <p className="text-gray-400 text-sm font-bold uppercase">{title}</p>
                {loading ? (
                    <div className="h-8 w-16 bg-f1-light-dark rounded animate-pulse mt-1"></div>
                ) : (
                    <p className="text-3xl font-black text-white">{value}</p>
                )}
            </div>
        </div>
    );

    return (
        <div>
            <h1 className="text-4xl font-black mb-8 uppercase tracking-wider text-white">
                Admin <span className="text-f1-red">Dashboard</span>
            </h1>

            {error ? (
                 <div className="bg-f1-light-dark p-6 rounded-lg border border-f1-red">
                    <h2 className="text-2xl font-bold text-f1-red mb-4">An Error Occurred</h2>
                    <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">{error}</pre>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StatCard icon={<VideoIcon className="w-10 h-10"/>} title="Total Replays" value={stats.replays} />
                        <StatCard icon={<DocumentTextIcon className="w-10 h-10"/>} title="Total Articles" value={stats.articles} />
                    </div>
                    <div className="mt-12 bg-f1-gray/50 p-6 rounded-lg">
                        <h2 className="text-xl font-bold text-white mb-2">Welcome to the F1 Full Replay Admin Panel!</h2>
                        <p className="text-gray-300">
                            Use the navigation on the left to manage race replays, articles, and site settings. All changes you make here will be instantly reflected on the live website.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardPage;
