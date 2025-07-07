
import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import ArticleCard from '../components/ArticleCard';
import { supabase } from '../lib/supabaseClient';
import { getSupabaseErrorMessage } from '../lib/errorHelper';

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('articles')
          .select('id, created_at, slug, title, excerpt, content, image_url, author, published_at')
          .order('published_at', { ascending: false });
        
        if (error) throw error;
        setArticles(data || []);
      } catch (err: any) {
        setError(getSupabaseErrorMessage(err, "fetching articles"));
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-xl font-semibold">Loading Articles...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 max-w-3xl">
          <div className="bg-f1-light-dark p-6 rounded-lg border border-f1-red">
              <h2 className="text-2xl font-bold text-f1-red mb-4">An Error Occurred</h2>
              <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">{error}</pre>
          </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-black mb-8 uppercase tracking-wider text-white">
        F1 Articles <span className="text-f1-red">& Insights</span>
      </h1>
      
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-400">No Articles Found</h2>
          <p className="text-gray-500 mt-2">Check back later for more F1 insights and stories.</p>
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;