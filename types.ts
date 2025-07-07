import { Database } from './lib/database.types';

export type Article = Database['public']['Tables']['articles']['Row'];
export type SiteSettings = Database['public']['Tables']['settings']['Row'];
export type GrandPrix = Database['public']['Tables']['grands_prix']['Row'];

// Defines the structure for an individual stream link inside the JSONB array
export type StreamLink = {
    type: 'iframe' | 'hls' | 'dash';
    url: string;
};

// This represents the raw data from the 'replays' table
type ReplayRow = Database['public']['Tables']['replays']['Row'];

// This is the hydrated type we'll use throughout the app, joining replay data with GP info
export interface RaceReplay extends Omit<ReplayRow, 'streams' | 'grand_prix_id'> {
    streams: StreamLink[];
    grands_prix: {
        name: string;
    } | null;
}
