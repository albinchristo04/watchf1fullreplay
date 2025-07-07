import React from 'react';
import { Link } from 'react-router-dom';
import { RaceReplay } from '../types';

interface RaceCardProps {
  replay: RaceReplay;
}

const RaceCard: React.FC<RaceCardProps> = ({ replay }) => {
  const gpName = replay.grands_prix?.name ?? 'Unknown Grand Prix';
  return (
    <Link to={`/player/${replay.id}`} state={{ replay }}>
      <div className="group bg-f1-light-dark rounded-lg overflow-hidden shadow-lg hover:shadow-f1-red/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 border border-f1-gray/30 hover:border-f1-red/50">
        <div className="relative">
          <img className="w-full h-48 object-cover" src={replay.thumbnail_url ?? 'https://via.placeholder.com/400x200?text=F1+Replay'} alt={`${gpName} thumbnail`} />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-all duration-300"></div>
           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-f1-red p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-400 font-semibold">{replay.year}</p>
          <h3 className="text-lg font-bold text-white group-hover:text-f1-red transition-colors duration-300">{gpName}</h3>
        </div>
      </div>
    </Link>
  );
};

export default RaceCard;