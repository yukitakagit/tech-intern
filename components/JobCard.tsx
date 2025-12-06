
import React, { useState } from 'react';
import { JobListing } from '../types';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { analyzeMatch } from '../services/geminiService';

interface JobCardProps {
  job: JobListing;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [matchAnalysis, setMatchAnalysis] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Simulated student profile for demo purposes
  const mockStudentProfile = "Web開発に興味がある大学3年生。ReactとTypeScriptの勉強中。実務経験はないが、GitHubに個人開発のTodoアプリを上げている。";

  const handleAIMatch = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (matchAnalysis) return;

    setLoadingAI(true);
    const result = await analyzeMatch(job, mockStudentProfile);
    setMatchAnalysis(result);
    setLoadingAI(false);
  };

  return (
    <div 
      className="group flex flex-col bg-white rounded-md overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-200 aspect-[1/1.3]"
    >
      {/* Card Header Image - Takes up ~65% of the card */}
      <div className="relative h-[65%] w-full overflow-hidden">
        <img 
          src={job.coverImageUrl} 
          alt={job.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Overlay on hover for tech feel */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
        
        {/* Floating AI Button (Subtle) */}
        <button 
            onClick={handleAIMatch}
            disabled={loadingAI}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full text-gray-800 shadow-md hover:bg-black hover:text-white transition-all z-20"
            title="AIマッチング分析"
        >
             {loadingAI ? <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"/> : <Sparkles size={16} />}
        </button>
      </div>

      {/* Card Content - Minimalist */}
      <div className="flex-1 p-5 flex flex-col bg-white relative">
        <div>
            {/* Company Name (Removed Logo) */}
            <div className="mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide truncate">
                    {job.company.name}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {job.title}
            </h3>
        </div>

        {/* Tags - Minimal */}
        <div className="mt-4 flex flex-wrap gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
            {job.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-sm">
                    #{tag}
                </span>
            ))}
        </div>
        
        {/* AI Analysis Result Overlay (if active) */}
        {matchAnalysis && (
             <div className="absolute inset-x-0 bottom-0 p-3 bg-blue-50/95 backdrop-blur-sm border-t border-blue-100 text-xs text-gray-800 animate-fade-in-up z-10 shadow-lg">
                <div className="flex items-center gap-1 text-blue-700 font-bold mb-1">
                    <Sparkles size={10} />
                    <span>AI Analysis</span>
                </div>
                {matchAnalysis}
             </div>
        )}

        {/* Hover Arrow */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <ArrowUpRight size={20} className="text-gray-400 group-hover:text-black" />
        </div>
      </div>
    </div>
  );
};
