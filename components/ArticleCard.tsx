import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <Link to={`/articles/${article.slug}`} className="block group">
      <div className="bg-f1-light-dark rounded-lg overflow-hidden shadow-lg hover:shadow-f1-red/20 hover:shadow-2xl transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1.5 border border-f1-gray/30 hover:border-f1-red/50">
        <div className="relative">
          <img className="w-full h-48 object-cover" src={article.image_url} alt={`${article.title} thumbnail`} />
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-white group-hover:text-f1-red transition-colors duration-300 flex-grow">{article.title}</h3>
          <p className="text-gray-400 mt-2 text-sm leading-relaxed">{article.excerpt}</p>
          <div className="mt-4 text-f1-red font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
            Read More
            <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
