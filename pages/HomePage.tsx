import React, { useState, useEffect, useMemo } from 'react';
import { RaceReplay, Article, GrandPrix } from '../types';
import RaceCard from '../components/RaceCard';
import ArticleCard from '../components/ArticleCard';
import { supabase } from '../lib/supabaseClient';
import { getSupabaseErrorMessage } from '../lib/errorHelper';

const HomePage: React.FC = () => {
  const [allReplays, setAllReplays] = useState<RaceReplay[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [grandsPrix, setGrandsPrix] = useState<GrandPrix[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedGp, setSelectedGp] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [replaysResponse, articlesResponse, gpResponse] = await Promise.all([
          supabase
            .from('replays')
            .select('id, year, thumbnail_url, streams, created_at, grands_prix(name)')
            .order('year', { ascending: false })
            .order('created_at', { ascending: false }),
          supabase.from('articles').select('id, slug, title, excerpt, image_url, author, published_at, content, created_at').order('published_at', { ascending: false }).limit(3),
          supabase.from('grands_prix').select('id, name, country').order('name', { ascending: true })
        ]);
        
        if (replaysResponse.error) throw replaysResponse.error;
        if (articlesResponse.error) throw articlesResponse.error;
        if (gpResponse.error) throw gpResponse.error;
        
        setAllReplays((replaysResponse.data as RaceReplay[]) || []);
        setArticles(articlesResponse.data || []);
        setGrandsPrix(gpResponse.data || []);

      } catch (err: any) {
        setError(getSupabaseErrorMessage(err, "fetching home page data"));
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredReplays = useMemo(() => {
    return allReplays.filter(replay => {
      const yearMatch = selectedYear === 'all' || replay.year === parseInt(selectedYear, 10);
      const gpMatch = selectedGp === 'all' || (replay as any).grand_prix_id === selectedGp || replay.grands_prix?.name === selectedGp; // Looser match for client-side
      // Note: The above is a bit of a hack since grand_prix_id isn't in our select. A better approach might be to filter by `replay.grands_prix.id` if we selected it.
      // Let's assume the filter value from the dropdown is the GP's ID string.
      const gpIdMatch = selectedGp === 'all' || replay.grands_prix?.name === grandsPrix.find(gp => gp.id === selectedGp)?.name;
      return yearMatch && gpIdMatch;
    });
  }, [allReplays, selectedYear, selectedGp, grandsPrix]);

  const replaysByYear = useMemo(() => {
    return filteredReplays.reduce((acc, replay) => {
      const year = replay.year;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(replay);
      return acc;
    }, {} as Record<number, RaceReplay[]>);
  }, [filteredReplays]);

  const sortedYears = useMemo(() => {
    return Object.keys(replaysByYear).map(Number).sort((a, b) => b - a);
  }, [replaysByYear]);
  
  const uniqueYears = useMemo(() => {
    const years = new Set(allReplays.map(r => r.year));
    return Array.from(years).sort((a, b) => b - a);
  }, [allReplays]);

  if (loading) {
    return <div className="text-center py-20 text-xl font-semibold">Loading...</div>;
  }

  if (error) {
    return (
        <div className="container mx-auto p-8 max-w-3xl">
            <div className="bg-f1-light-dark p-6 rounded-lg border border-f1-red">
                <h2 className="text-2xl font-bold text-f1-red mb-4">Application Configuration Needed</h2>
                <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">{error}</pre>
            </div>
        </div>
    );
  }

  const FilterSelect: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode}> = ({label, value, onChange, children}) => (
    <div>
      <label htmlFor={label} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <select
        id={label}
        value={value}
        onChange={onChange}
        className="form-select w-full bg-f1-gray border-f1-gray/50 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-f1-red focus:border-transparent transition"
      >
        {children}
      </select>
    </div>
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">

      {/* Filters */}
      <div className="bg-f1-light-dark p-4 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <h3 className="text-xl font-bold text-white md:col-span-1">Filter Races</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-2">
          <FilterSelect label="Year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="all">All Years</option>
            {uniqueYears.map(year => <option key={year} value={year}>{year}</option>)}
          </FilterSelect>
          <FilterSelect label="Grand Prix" value={selectedGp} onChange={(e) => setSelectedGp(e.target.value)}>
            <option value="all">All Grands Prix</option>
            {grandsPrix.map(gp => <option key={gp.id} value={gp.id}>{gp.name}</option>)}
          </FilterSelect>
        </div>
      </div>

      {sortedYears.length > 0 ? (
        sortedYears.map(year => (
          <section key={year} className="mb-12">
            <h2 className="text-4xl font-black mb-8 uppercase tracking-wider text-white">
              {year} <span className="text-f1-red">Season Replays</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {replaysByYear[year].map(replay => (
                <RaceCard key={replay.id} replay={replay} />
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-400">No Replays Found</h2>
          <p className="text-gray-500 mt-2">Try adjusting the filters or go to the Admin Panel to add new race replays.</p>
        </div>
      )}
      
      {articles.length > 0 && (
        <section className="mt-16">
           <h2 className="text-4xl font-black mb-8 uppercase tracking-wider text-white">
              Latest <span className="text-f1-red">Articles</span>
            </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
           </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;