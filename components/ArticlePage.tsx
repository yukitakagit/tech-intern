
import React from 'react';
import { Article } from '../types';

interface ArticlePageProps {
  article: Article;
  onBack: () => void;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({ article, onBack }) => {
  return (
    <div className="bg-white min-h-screen pb-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
            <button onClick={onBack} className="text-sm font-bold text-gray-500 hover:text-black mb-8 flex items-center gap-1">
                &larr; 記事一覧に戻る
            </button>

            <span className="inline-block bg-black text-white text-xs font-bold px-3 py-1 mb-4">
                {article.category}
            </span>

            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
                {article.title}
            </h1>

            <div className="flex items-center gap-3 text-sm text-gray-500 font-bold mb-10 border-b border-gray-100 pb-8">
                <span>{article.date}</span>
            </div>

            <div className="mb-12 rounded-sm overflow-hidden shadow-sm">
                <img src={article.image} alt={article.title} className="w-full h-auto object-cover" />
            </div>

            {/* Content Body */}
            <div 
                className="prose prose-lg prose-gray max-w-none font-medium text-gray-800"
                dangerouslySetInnerHTML={{ __html: article.content }}
            />
        </div>
    </div>
  );
};
