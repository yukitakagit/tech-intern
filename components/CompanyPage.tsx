import React from 'react';
import { Company, JobListing } from '../types';
import { JOB_LISTINGS } from '../constants';
import { MapPin, Globe, Calendar, Briefcase, ArrowRight } from 'lucide-react';
import { JobCard } from './JobCard';

interface CompanyPageProps {
  company: Company;
  onBack: () => void;
  onNavigateJobDetail: (id: string) => void;
  fromJobId?: string; // Track origin to go back to specific job
}

export const CompanyPage: React.FC<CompanyPageProps> = ({ company, onBack, onNavigateJobDetail, fromJobId }) => {
  // Find other jobs for this company
  const companyJobs = JOB_LISTINGS.filter(j => j.company.id === company.id);

  const handleBack = () => {
      if (fromJobId) {
          onNavigateJobDetail(fromJobId);
      } else {
          onBack();
      }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
       {/* Hero Image */}
       <div className="relative h-[350px] md:h-[500px] w-full bg-gray-200">
            {company.coverImage ? (
                <img src={company.coverImage} alt="Company Office" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-gray-600 font-bold">No Cover Image</span>
                </div>
            )}
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* Top Back Button */}
            <div className="absolute top-6 left-6 z-20">
                <button onClick={handleBack} className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors">
                    &larr; {fromJobId ? '募集詳細に戻る' : 'HOMEに戻る'}
                </button>
            </div>

            {/* Name Overlay (Removed small logo) */}
            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent">
                 <div className="max-w-7xl mx-auto">
                    <div className="mb-2">
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">{company.name}</h1>
                        <p className="text-white/80 font-bold text-sm flex items-center gap-2">
                             <MapPin size={16}/> {company.location}
                             {company.industry && <span className="ml-4 opacity-60">| {company.industry}</span>}
                        </p>
                    </div>
                 </div>
            </div>
       </div>

       <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-20">
                    
                    {/* Mission */}
                    <section>
                        <h2 className="text-3xl font-black text-gray-900 mb-6">
                            {company.mission || "Mission"}
                        </h2>
                        <p className="text-gray-800 text-lg leading-relaxed font-medium">
                            {company.description}
                        </p>
                    </section>

                    {/* Work Overview */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                             <div className="w-10 h-1 bg-black"></div>
                             <h3 className="text-xl font-black text-gray-900 uppercase">仕事概要・業務内容</h3>
                        </div>
                        <p className="text-gray-700 leading-8 whitespace-pre-wrap">
                            私たちは、最先端の技術を活用してクライアントの課題を解決するプロフェッショナル集団です。
                            エンジニアインターンの皆様には、実際のプロジェクトチームに参加していただき、
                            要件定義から設計、実装、テストまでの一連の開発プロセスを経験していただきます。
                            メンター社員がマンツーマンでサポートするため、実務未経験の方でも安心してスキルアップできる環境です。
                        </p>
                    </section>

                    {/* Recruitment Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                             <div className="w-10 h-1 bg-black"></div>
                             <h3 className="text-xl font-black text-gray-900 uppercase">募集中</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {companyJobs.map(job => (
                                 <div key={job.id} onClick={() => onNavigateJobDetail(job.id)} className="cursor-pointer">
                                     <JobCard job={job} />
                                 </div>
                             ))}
                        </div>
                    </section>

                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-8 rounded-sm sticky top-24">
                        <h3 className="font-black text-lg mb-6 uppercase tracking-wider">Company Profile</h3>
                        <div className="space-y-6 text-sm">
                            <div>
                                <h4 className="font-bold text-gray-500 text-xs uppercase mb-1">会社名</h4>
                                <p className="font-bold text-gray-900">{company.name}</p>
                            </div>
                            {company.representative && (
                                <div>
                                    <h4 className="font-bold text-gray-500 text-xs uppercase mb-1">代表者</h4>
                                    <p className="font-bold text-gray-900">{company.representative}</p>
                                </div>
                            )}
                             {company.industry && (
                                <div>
                                    <h4 className="font-bold text-gray-500 text-xs uppercase mb-1">業界</h4>
                                    <p className="font-bold text-gray-900">{company.industry}</p>
                                </div>
                            )}
                             {company.employees && (
                                <div>
                                    <h4 className="font-bold text-gray-500 text-xs uppercase mb-1">従業員数</h4>
                                    <p className="font-bold text-gray-900">{company.employees}</p>
                                </div>
                            )}
                             <div>
                                <h4 className="font-bold text-gray-500 text-xs uppercase mb-1">住所</h4>
                                <p className="font-bold text-gray-900">{company.address || company.location}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-500 text-xs uppercase mb-1">設立</h4>
                                <p className="font-bold text-gray-900">{company.established || '-'}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-500 text-xs uppercase mb-1">URL</h4>
                                <a href={company.url} target="_blank" rel="noreferrer" className="font-bold text-blue-600 hover:underline break-all">
                                    {company.url || 'https://tech-intern.com'}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
       </div>
    </div>
  );
};