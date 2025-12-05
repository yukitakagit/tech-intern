
import React from 'react';
import { Article } from '../types';
import { ArrowLeft } from 'lucide-react';

interface ArticleListPageProps {
  articles: Article[];
  onNavigateArticle: (id: number) => void;
  onBack: () => void;
}

export const ArticleListPage: React.FC<ArticleListPageProps> = ({ articles, onNavigateArticle, onBack }) => {
  // Only show published articles
  const publishedArticles = articles.filter(a => a.status !== 'draft');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
         <div className="max-w-7xl mx-auto">
            <button onClick={onBack} className="text-sm font-bold text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors">
                <ArrowLeft size={16}/> HOMEに戻る
            </button>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">INTERNSHIP COLUMN</h1>
            <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">コラム一覧</p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedArticles.map(article => (
                  <article 
                    key={article.id} 
                    className="group cursor-pointer flex flex-col gap-4"
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
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-gray-400">{article.date}</span>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-gray-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                  </article>
              ))}
          </div>
      </div>
    </div>
  );
};
