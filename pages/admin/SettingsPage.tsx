import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { SiteSettings } from '../../types';
import { getSupabaseErrorMessage } from '../../lib/errorHelper';
import { Database } from '../../lib/database.types';

const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<Partial<SiteSettings>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            setError(null);
            const { data, error } = await supabase.from('settings').select('id, site_title, site_description').eq('id', 1).single();
            if (error && error.code !== 'PGRST116') { // Ignore 'exact one row was not found' error
                setError(getSupabaseErrorMessage(error, 'fetching settings'));
            } else if (data) {
                setSettings(data);
            }
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setError(null);
        
        const settingsToUpdate: Database['public']['Tables']['settings']['Update'] = {
            site_title: settings.site_title,
            site_description: settings.site_description
        };

        const { error } = await supabase.from('settings').update(settingsToUpdate).eq('id', 1);

        if (error) {
            setError(getSupabaseErrorMessage(error, 'saving settings'));
        } else {
            setMessage('Settings saved successfully!');
        }
        setSaving(false);
        setTimeout(() => setMessage(''), 3000);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({...prev, [name]: value}));
    };

    if (loading) {
        return <p>Loading settings...</p>;
    }

    return (
        <div>
            <h1 className="text-4xl font-black mb-8 uppercase tracking-wider text-white">General <span className="text-f1-red">Settings</span></h1>
            
            {error && (
                 <div className="bg-red-900/50 border border-f1-red text-red-200 p-3 rounded-md text-sm whitespace-pre-wrap font-mono mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
                <div>
                    <label htmlFor="site_title" className="block text-sm font-medium text-gray-300 mb-1">Site Title</label>
                    <input
                        type="text"
                        name="site_title"
                        id="site_title"
                        value={settings.site_title || ''}
                        onChange={handleChange}
                        className="form-input mt-1 block w-full bg-f1-gray border-transparent rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-f1-red focus:border-transparent transition"
                    />
                </div>
                <div>
                    <label htmlFor="site_description" className="block text-sm font-medium text-gray-300 mb-1">Site Description</label>
                     <textarea
                        name="site_description"
                        id="site_description"
                        rows={3}
                        value={settings.site_description || ''}
                        onChange={handleChange}
                        className="form-textarea mt-1 block w-full bg-f1-gray border-transparent rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-f1-red focus:border-transparent transition"
                    ></textarea>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-bold rounded-md shadow-lg text-white bg-f1-red hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                    {message && <p className="text-sm text-green-400">{message}</p>}
                </div>
            </form>
        </div>
    );
};

export default SettingsPage;