
import React from 'react';
import { JobListing, FilterState } from '../types';
import { Sidebar } from './Sidebar';
import { JobCard } from './JobCard';
import { ArrowLeft } from 'lucide-react';

interface AllJobsPageProps {
  jobs: JobListing[];
  onNavigateJobDetail: (id: string) => void;
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const AllJobsPage: React.FC<AllJobsPageProps> = ({ 
    jobs, 
    onNavigateJobDetail, 
    onNavigateHome,
    onNavigateProfile,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters
}) => {
  return (
    <div className="min-h-screen bg-gray-50/50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1400px] mx-auto">
                <button onClick={onNavigateHome} className="text-sm font-bold text-gray-400 hover:text-black mb-6 flex items-center gap-2 transition-colors">
                    <ArrowLeft size={16}/> HOMEに戻る
                </button>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">募集職種一覧</h1>
                <p className="text-gray-500 font-bold text-sm mt-2">All Open Positions</p>
            </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row gap-12">
                
                <Sidebar 
                    onNavigateProfile={onNavigateProfile}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filters={filters}
                    setFilters={setFilters}
                />

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                        <span className="text-sm font-bold text-gray-500">
                            <span className="text-black font-black text-xl mr-1">{jobs.length}</span> results
                        </span>
                    </div>

                    {jobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {jobs.map((job, index) => (
                                <div 
                                    key={job.id} 
                                    onClick={() => onNavigateJobDetail(job.id)} 
                                    className="cursor-pointer"
                                >
                                    <JobCard job={job} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-sm border border-gray-200">
                            <p className="text-gray-500 font-bold">条件に一致する求人は見つかりませんでした。</p>
                            <button onClick={() => { setSearchQuery(''); setFilters({occupations: [], languages: [], industries: [], areas: [], characteristics: []}); }} className="mt-4 text-blue-600 font-bold hover:underline">
                                検索条件をクリアする
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};
