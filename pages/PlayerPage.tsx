import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { RaceReplay, StreamLink } from '../types';
import { supabase } from '../lib/supabaseClient';
import { getSupabaseErrorMessage } from '../lib/errorHelper';
import HlsPlayer from '../components/HlsPlayer';

const PlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  
  const [replay, setReplay] = useState<RaceReplay | null>(location.state?.replay ?? null);
  const [loading, setLoading] = useState(!replay);
  const [error, setError] = useState<string | null>(null);
  const [activeStream, setActiveStream] = useState<StreamLink | null>(null);

  useEffect(() => {
    // If replay data wasn't passed in state (e.g., direct navigation), fetch it.
    if (!replay && id) {
      const fetchReplay = async () => {
        try {
          setLoading(true);
          setError(null);
          const { data, error } = await supabase
            .from('replays')
            .select('id, year, streams, thumbnail_url, created_at, grands_prix(name)')
            .eq('id', id)
            .single();

          if (error) throw error;
          setReplay(data as any);
        } catch (err: any) {
          setError(getSupabaseErrorMessage(err, 'fetching replay'));
          console.error("Error fetching replay:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchReplay();
    }
  }, [id, replay]);

  useEffect(() => {
    // Set the initial active stream once the replay data is available
    if (replay && replay.streams && replay.streams.length > 0) {
      setActiveStream(replay.streams[0]);
    }
  }, [replay]);

  if (loading) {
    return <div className="text-center py-20 text-xl font-semibold">Loading Replay...</div>;
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-8 max-w-3xl">
          <div className="bg-f1-light-dark p-6 rounded-lg border border-f1-red">
              <h2 className="text-2xl font-bold text-f1-red mb-4">An Error Occurred</h2>
              <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">{error}</pre>
               <Link to="/" className="inline-block bg-f1-red text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors mt-6">
                  Back to Home
              </Link>
          </div>
      </div>
    );
  }
  
  if (!replay) {
    return (
        <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-f1-red mb-4">Replay Not Found</h2>
            <p className="text-gray-400 mb-8">The video you are looking for does not exist or could not be loaded.</p>
            <Link to="/" className="inline-block bg-f1-red text-white font-bold py-2 px-6 rounded-md hover:bg-red-700 transition-colors">
                Back to Home
            </Link>
        </div>
    );
  }

  const gpName = replay.grands_prix?.name ?? 'Unknown Grand Prix';

  const renderPlayer = () => {
    if (!activeStream) {
        return <div className="w-full h-full bg-black flex items-center justify-center text-gray-400">No stream selected or available.</div>;
    }

    switch (activeStream.type) {
        case 'iframe':
            return (
                <iframe
                    src={activeStream.url}
                    title={`${gpName} Replay - Iframe`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                ></iframe>
            );
        case 'hls':
            return <HlsPlayer src={activeStream.url} />;
        case 'dash':
            // Placeholder for DASH player
            return <div className="w-full h-full bg-black flex items-center justify-center text-gray-400">DASH streams are not yet supported.</div>;
        default:
            return <div className="w-full h-full bg-black flex items-center justify-center text-gray-400">Unsupported stream type.</div>;
    }
  };

  return (
    <div className="container mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <p className="text-lg font-semibold text-gray-400">{replay.year}</p>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-wider uppercase">{gpName}</h1>
        <h2 className="text-2xl font-bold text-f1-red mt-1">Full Race Replay</h2>
      </div>
      
      {replay.streams && replay.streams.length > 1 && (
        <div className="mb-4 flex items-center border-b border-f1-gray space-x-4">
            {replay.streams.map((stream, index) => (
                <button
                    key={index}
                    onClick={() => setActiveStream(stream)}
                    className={`py-2 px-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
                        activeStream?.url === stream.url
                            ? 'border-f1-red text-white'
                            : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                >
                    {stream.type} Player
                </button>
            ))}
        </div>
      )}

      <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-f1-gray/50 ring-4 ring-f1-red/50">
        {renderPlayer()}
      </div>
       <div className="mt-6">
            <Link to="/" className="text-f1-red hover:text-red-400 transition-colors font-semibold inline-flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                Back to all races
            </Link>
        </div>
    </div>
  );
};

export default PlayerPage;