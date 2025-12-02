
import React from 'react';
import { JobListing } from '../types';
import { MapPin, Clock, DollarSign, ArrowRight, CheckCircle, Users, Briefcase, Star, Building2 } from 'lucide-react';

interface JobDetailPageProps {
  job: JobListing;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onNavigateCompany: (companyId: string) => void;
  onBack: () => void;
}

export const JobDetailPage: React.FC<JobDetailPageProps> = ({ job, isFavorite, onToggleFavorite, onNavigateCompany, onBack }) => {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Header - Company Atmosphere */}
      <div className="relative h-[400px] w-full bg-gray-900">
        <img 
          src={job.coverImageUrl} 
          alt={job.title} 
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white max-w-7xl mx-auto">
           <button onClick={onBack} className="text-sm font-bold text-gray-300 hover:text-white mb-6 flex items-center gap-1">
             &larr; 募集一覧に戻る
           </button>
           <div 
             className="inline-flex items-center gap-3 mb-4 cursor-pointer hover:opacity-80 transition-opacity bg-white/10 backdrop-blur-md px-4 py-2 rounded-full"
             onClick={() => onNavigateCompany(job.company.id)}
           >
              <img src={job.company.logoUrl} className="w-8 h-8 rounded-full bg-white border border-white" alt=""/>
              <span className="font-bold tracking-wider">{job.company.name}</span>
           </div>
           <h1 className="text-2xl md:text-4xl font-black leading-tight mb-6 max-w-4xl">{job.title}</h1>
           <div className="flex flex-wrap gap-2">
             {job.tags.map(tag => (
               <span key={tag} className="px-3 py-1 bg-white text-black rounded-sm text-xs font-bold">
                 #{tag}
               </span>
             ))}
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Main Content */}
          <div className="flex-1 space-y-16">
            
            {/* Intro / Narrative Description */}
            <section>
                 <p className="text-gray-800 leading-8 text-base font-medium whitespace-pre-wrap">
                    {job.description}
                </p>
            </section>

            {/* Business Content - No Frame, No Title */}
            {(job.businessContent) && (
                <section>
                    <p className="text-gray-800 leading-8 text-base font-medium whitespace-pre-wrap">
                        {job.businessContent}
                    </p>
                </section>
            )}

            {/* Job Detail */}
            <section>
                <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                   こんなことやります
                </h3>
                <p className="text-gray-800 leading-8 text-base font-medium whitespace-pre-wrap">
                    {job.jobDetail}
                </p>
            </section>

            {/* Skills - Simple List */}
            <section className="border-t border-gray-100 pt-10">
                <h3 className="text-xl font-black text-gray-900 mb-6">
                    身につくスキル
                </h3>
                <div className="flex flex-wrap gap-3">
                    {job.skillsGained?.map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-sm text-sm font-bold text-gray-700">
                            <CheckCircle size={14} className="text-blue-600"/>
                            {skill}
                        </div>
                    ))}
                    {!job.skillsGained && <p className="text-gray-500">詳細はお問い合わせください</p>}
                </div>
            </section>

             {/* Flow */}
             <section className="border-t border-gray-100 pt-10">
                <h3 className="text-xl font-black text-gray-900 mb-8">
                    選考フロー
                </h3>
                <div className="space-y-8">
                    {job.selectionFlow?.map((flow, idx) => (
                        <div key={idx} className="flex gap-6 relative group">
                            {/* Connector Line */}
                            {idx !== (job.selectionFlow!.length - 1) && (
                                <div className="absolute left-5 top-10 bottom-[-32px] w-0.5 bg-gray-200 group-hover:bg-gray-300 transition-colors"></div>
                            )}
                            
                            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg flex-shrink-0 z-10 shadow-lg">
                                {flow.step}
                            </div>
                            <div className="pt-1">
                                <h4 className="font-bold text-lg text-gray-900 mb-1">{flow.title}</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">{flow.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
          </div>

          {/* Sidebar - Redesigned */}
          <div className="w-full lg:w-96 space-y-8">
            <div 
                className="bg-white rounded-sm shadow-xl border border-gray-100 sticky top-24 overflow-hidden cursor-pointer group hover:border-blue-500 transition-colors"
            >
                {/* Top Half Image */}
                <div 
                    className="h-32 w-full bg-gray-200 relative overflow-hidden"
                    onClick={() => onNavigateCompany(job.company.id)}
                >
                    <img src={job.company.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt=""/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                        <img src={job.company.logoUrl} className="w-10 h-10 rounded-full border-2 border-white" alt=""/>
                        <div className="text-white">
                            <h4 className="font-bold text-sm leading-tight">{job.company.name}</h4>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Detailed Company Info */}
                    <div className="space-y-4 mb-8 text-sm">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                             <div className="flex items-center gap-2 text-gray-500 font-bold">
                                <Briefcase size={16}/> <span>業界</span>
                             </div>
                             <span className="font-bold text-gray-900">{job.company.industry || '-'}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                             <div className="flex items-center gap-2 text-gray-500 font-bold">
                                <Users size={16}/> <span>従業員数</span>
                             </div>
                             <span className="font-bold text-gray-900">{job.company.employees || '-'}</span>
                        </div>
                         <div className="flex flex-col gap-1 border-b border-gray-100 pb-2">
                             <div className="flex items-center gap-2 text-gray-500 font-bold mb-1">
                                <Building2 size={16}/> <span>本社所在地</span>
                             </div>
                             <span className="font-bold text-gray-900 leading-snug">{job.company.address || job.company.location}</span>
                        </div>
                    </div>
                    
                    {/* Job Conditions (Brief) */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-50 p-3 rounded-sm">
                            <span className="block text-xs font-bold text-gray-400 mb-1">給与</span>
                            <span className="block font-black text-gray-900 text-sm">{job.salary}</span>
                        </div>
                         <div className="bg-gray-50 p-3 rounded-sm">
                            <span className="block text-xs font-bold text-gray-400 mb-1">勤務形態</span>
                            <span className="block font-black text-gray-900 text-sm">{job.workStyle}</span>
                        </div>
                    </div>

                    <button className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-sm shadow-md transition-all flex items-center justify-center gap-3 group relative z-10">
                        話を聞きに行きたい <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                    
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite();
                        }}
                        className={`w-full mt-3 border-2 font-bold py-3 px-6 rounded-sm transition-all text-sm flex items-center justify-center gap-2 relative z-10 ${isFavorite ? 'bg-yellow-50 border-yellow-400 text-yellow-600' : 'bg-white border-gray-100 text-gray-500 hover:border-black hover:text-black'}`}
                    >
                        <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
                        {isFavorite ? 'お気に入りに追加済み' : 'お気に入りに追加'}
                    </button>
                    
                     <div 
                        className="mt-6 pt-4 border-t border-gray-100 cursor-pointer group/link text-center"
                        onClick={() => onNavigateCompany(job.company.id)}
                     >
                        <span className="text-xs font-bold text-gray-400 group-hover/link:text-blue-600 transition-colors flex items-center justify-center gap-1">
                            企業の詳細情報を見る <ArrowRight size={12} />
                        </span>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
