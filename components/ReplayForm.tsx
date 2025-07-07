import React, { useState, useEffect } from 'react';
import { RaceReplay, GrandPrix, StreamLink } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ReplayFormProps {
    onSubmit: (replayData: any) => void;
    onClose: () => void;
    initialData?: RaceReplay | null;
    grandsPrix: GrandPrix[];
    error?: string | null;
    isSubmitting?: boolean;
}

const ReplayForm: React.FC<ReplayFormProps> = ({ onSubmit, onClose, initialData, grandsPrix, error, isSubmitting }) => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [grandPrixId, setGrandPrixId] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [streams, setStreams] = useState<StreamLink[]>([]);
    
    useEffect(() => {
        if (initialData) {
            setYear(initialData.year);
            setGrandPrixId((initialData as any).grand_prix_id); // The type is slightly different in the form
            setThumbnailUrl(initialData.thumbnail_url ?? '');
            setStreams(initialData.streams ?? []);
        } else {
            // Reset form for new entry
            setYear(new Date().getFullYear());
            setGrandPrixId(grandsPrix[0]?.id || '');
            setThumbnailUrl('');
            setStreams([]);
        }
    }, [initialData, grandsPrix]);
    
    const handleStreamChange = (index: number, field: keyof StreamLink, value: string) => {
        const newStreams = [...streams];
        newStreams[index] = { ...newStreams[index], [field]: value };
        setStreams(newStreams);
    };
    
    const addStream = () => {
        setStreams([...streams, { type: 'iframe', url: '' }]);
    };
    
    const removeStream = (index: number) => {
        setStreams(streams.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!grandPrixId) {
            alert('Please select a Grand Prix.');
            return;
        }
        onSubmit({
            year,
            grand_prix_id: grandPrixId,
            thumbnail_url: thumbnailUrl,
            streams,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-900/50 border border-f1-red text-red-200 p-3 rounded-md text-sm whitespace-pre-wrap font-mono">
                    <p className="font-bold mb-2">Error Saving Replay:</p>
                    {error}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-1">Year</label>
                    <input
                        type="number"
                        id="year"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="form-input mt-1 block w-full"
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div>
                    <label htmlFor="grand_prix_id" className="block text-sm font-medium text-gray-300 mb-1">Grand Prix</label>
                    <select
                        id="grand_prix_id"
                        value={grandPrixId}
                        onChange={(e) => setGrandPrixId(e.target.value)}
                        className="form-select mt-1 block w-full"
                        required
                        disabled={isSubmitting}
                    >
                        <option value="" disabled>Select a Grand Prix</option>
                        {grandsPrix.map(gp => (
                            <option key={gp.id} value={gp.id}>{gp.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div>
                <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-300 mb-1">Thumbnail Image URL</label>
                <input
                    type="url"
                    id="thumbnailUrl"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="form-input mt-1 block w-full"
                    disabled={isSubmitting}
                />
            </div>

            {/* Stream Links Management */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-2">Stream Links</h3>
                <div className="space-y-4">
                    {streams.map((stream, index) => (
                        <div key={index} className="flex gap-2 items-end p-3 bg-f1-gray/50 rounded-md">
                            <div className="flex-grow">
                                <label className="text-xs font-medium text-gray-400">Type</label>
                                <select 
                                    value={stream.type} 
                                    onChange={(e) => handleStreamChange(index, 'type', e.target.value)}
                                    className="form-select mt-1 block w-full text-sm"
                                    disabled={isSubmitting}
                                >
                                    <option value="iframe">Iframe</option>
                                    <option value="hls">HLS (m3u8)</option>
                                    <option value="dash">DASH</option>
                                </select>
                            </div>
                            <div className="flex-grow-[3]">
                                <label className="text-xs font-medium text-gray-400">URL</label>
                                <input
                                    type="url"
                                    placeholder="https://... "
                                    value={stream.url}
                                    onChange={(e) => handleStreamChange(index, 'url', e.target.value)}
                                    className="form-input mt-1 block w-full text-sm"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeStream(index)}
                                className="p-2 text-gray-400 hover:text-white bg-f1-gray hover:bg-f1-red rounded-md"
                                disabled={isSubmitting}
                                aria-label="Remove Stream"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addStream}
                    disabled={isSubmitting}
                    className="mt-4 inline-flex items-center px-3 py-2 border border-dashed border-f1-gray text-sm font-medium rounded-md text-gray-300 hover:text-white hover:border-f1-red transition-all"
                >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Stream Link
                </button>
            </div>

            <div className="flex justify-end pt-4 space-x-3">
                 <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center px-4 py-2 border border-f1-gray text-base font-bold rounded-md text-gray-300 bg-transparent hover:bg-f1-gray disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-bold rounded-md shadow-lg text-white bg-f1-red hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                    {isSubmitting ? 'Saving...' : (initialData ? 'Update Replay' : 'Add Replay')}
                </button>
            </div>
        </form>
    );
};

export default ReplayForm;