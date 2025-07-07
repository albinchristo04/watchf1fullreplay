
import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Article } from '../types';
import { supabase } from '../lib/supabaseClient';
import { getSupabaseErrorMessage } from '../lib/errorHelper';

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) {
        setLoading(false);
        setError("No article slug provided.");
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('articles')
          .select('id, created_at, slug, title, excerpt, content, image_url, author, published_at')
          .eq('slug', slug)
          .single();
        
        if (error) throw error;
        setArticle(data);
      } catch (err: any) {
        setError(getSupabaseErrorMessage(err, `fetching article "${slug}"`));
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-20 text-xl font-semibold">Loading Article...</div>;
  }

  if (error) {
    return (
        <div className="container mx-auto p-8 max-w-3xl">
            <div className="bg-f1-light-dark p-6 rounded-lg border border-f1-red">
                <h2 className="text-2xl font-bold text-f1-red mb-4">An Error Occurred</h2>
                <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">{error}</pre>
                <Link to="/articles" className="inline-block bg-f1-red text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors mt-6">
                    Back to Articles
                </Link>
            </div>
        </div>
    );
  }

  if (!article) {
     return <Navigate to="/articles" />;
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Link to="/articles" className="text-f1-red hover:text-red-400 transition-colors font-semibold">&larr; Back to all articles</Link>
      </div>

      <article className="bg-f1-light-dark rounded-lg shadow-xl overflow-hidden">
        <div className="relative">
          <img className="w-full h-64 md:h-96 object-cover" src={article.image_url ?? 'https://via.placeholder.com/1200x400?text=Article+Image'} alt={article.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-f1-light-dark to-transparent"></div>
        </div>
        <div className="p-6 sm:p-10">
          <header className="mb-8 border-b border-f1-gray/30 pb-6">
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-wide">{article.title}</h1>
            <p className="text-sm text-gray-400 mt-4">
              By <span className="font-semibold text-white">{article.author}</span> on <span className="font-semibold text-white">{new Date(article.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </p>
          </header>

          <div className="prose prose-lg max-w-none text-gray-300 whitespace-pre-line">
            {article.content}
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticlePage;