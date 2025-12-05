
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Article } from '../types';

interface ColumnSectionProps {
  articles: Article[];
  onNavigateArticle: (id: number) => void;
  onNavigateArticleList: () => void;
}

export const ColumnSection: React.FC<ColumnSectionProps> = ({ articles, onNavigateArticle, onNavigateArticleList }) => {
  // Only show published articles on Home
  const publishedArticles = articles.filter(a => a.status !== 'draft');

  return (
    <section className="py-20 border-t border-gray-200">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Internship Column</h2>
          <p className="text-xs font-bold text-gray-500 mt-2 tracking-widest">
            長期インターンに関するコラム
          </p>
        </div>
        <button 
          onClick={onNavigateArticleList} 
          className="hidden md:flex items-center gap-1 text-sm font-bold border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
        >
          VIEW ALL <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {publishedArticles.map((article) => (
          <article 
            key={article.id} 
            className="group cursor-pointer flex flex-col gap-3"
            onClick={() => onNavigateArticle(article.id)}
          >
            <div className="relative overflow-hidden aspect-[3/2] rounded-sm bg-gray-200">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                {article.category}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-gray-400">{article.date}</span>
              <h3 className="text-sm font-bold text-gray-900 leading-relaxed group-hover:text-gray-600 transition-colors line-clamp-2">
                {article.title}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
