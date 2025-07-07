import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { RaceReplay, GrandPrix } from '../../types';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import Modal from '../../components/Modal';
import ReplayForm from '../../components/ReplayForm';
import { getSupabaseErrorMessage } from '../../lib/errorHelper';
import { Database } from '../../lib/database.types';

const ManageReplaysPage: React.FC = () => {
    const [replays, setReplays] = useState<RaceReplay[]>([]);
    const [grandsPrix, setGrandsPrix] = useState<GrandPrix[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentReplay, setCurrentReplay] = useState<RaceReplay | null>(null);
    const [actionState, setActionState] = useState<{ error: string | null; isSubmitting: boolean }>({ error: null, isSubmitting: false });


    const fetchReplaysAndGPs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const replaysResponse = await supabase.from('replays').select('id, created_at, year, grand_prix_id, thumbnail_url, streams, grands_prix(name)').order('year', { ascending: false });
            const gpResponse = await supabase.from('grands_prix').select('id, name, country').order('name', { ascending: true });

            if (replaysResponse.error) throw replaysResponse.error;
            if (gpResponse.error) throw gpResponse.error;

            setReplays((replaysResponse.data as RaceReplay[]) || []);
            setGrandsPrix(gpResponse.data || []);

        } catch (err: any) {
            setError(getSupabaseErrorMessage(err, 'fetching replays and grands prix'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReplaysAndGPs();
    }, [fetchReplaysAndGPs]);

    const handleOpenModal = (replay: RaceReplay | null = null) => {
        setCurrentReplay(replay);
        setActionState({ error: null, isSubmitting: false });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentReplay(null);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this replay?')) {
            const { error } = await supabase.from('replays').delete().eq('id', id);
            if (error) {
                alert(getSupabaseErrorMessage(error, 'deleting replay'));
            } else {
                fetchReplaysAndGPs(); // Refresh list
            }
        }
    };

    const handleFormSubmit = async (replayData: any) => {
        setActionState({ error: null, isSubmitting: true });
        
        const dataToSubmit: Database['public']['Tables']['replays']['Update'] = {
            year: replayData.year,
            grand_prix_id: replayData.grand_prix_id,
            thumbnail_url: replayData.thumbnail_url,
            streams: replayData.streams
        };
        
        const query = currentReplay
            ? supabase.from('replays').update(dataToSubmit).eq('id', currentReplay.id)
            : supabase.from('replays').insert([dataToSubmit as Database['public']['Tables']['replays']['Insert']]);
        
        const { error } = await query;

        if (error) {
            setActionState({ error: getSupabaseErrorMessage(error, 'saving replay'), isSubmitting: false });
        } else {
            setActionState({ error: null, isSubmitting: false });
            handleCloseModal();
            fetchReplaysAndGPs();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-black uppercase tracking-wider text-white">Manage <span className="text-f1-red">Replays</span></h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-bold rounded-md shadow-lg text-white bg-f1-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-f1-dark focus:ring-f1-red transition-all transform hover:scale-105"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Add New Replay
                </button>
            </div>
            
            {loading && <p>Loading replays...</p>}
            {error && (
                <div className="bg-f1-light-dark p-6 rounded-lg border border-f1-red">
                    <h2 className="text-2xl font-bold text-f1-red mb-4">An Error Occurred</h2>
                    <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">{error}</pre>
                </div>
            )}
            
            {!loading && !error && (
                 <div className="bg-f1-dark shadow-xl rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-f1-gray">
                            <thead className="bg-f1-gray/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Year</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Grand Prix</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Streams</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-f1-light-dark divide-y divide-f1-gray">
                                {replays.map(replay => (
                                    <tr key={replay.id} className="hover:bg-f1-gray/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{replay.year}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{replay.grands_prix?.name ?? 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{replay.streams?.length ?? 0}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button onClick={() => handleOpenModal(replay)} className="text-blue-400 hover:text-blue-300">Edit</button>
                                            <button onClick={() => handleDelete(replay.id)} className="text-f1-red hover:text-red-400"><TrashIcon className="inline h-4 w-4"/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentReplay ? 'Edit Replay' : 'Add New Replay'}>
                <ReplayForm 
                    onSubmit={handleFormSubmit} 
                    onClose={handleCloseModal} 
                    initialData={currentReplay}
                    grandsPrix={grandsPrix}
                    error={actionState.error}
                    isSubmitting={actionState.isSubmitting}
                />
            </Modal>
        </div>
    );
};

export default ManageReplaysPage;