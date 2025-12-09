
import React from 'react';
import { JOB_LISTINGS } from '../constants';
import { ArrowLeft, MapPin, Users, Briefcase, Globe, ArrowRight } from 'lucide-react';

interface CompanyListPageProps {
  onBack: () => void;
  onNavigateCompanyDetail: (id: string) => void;
}

export const CompanyListPage: React.FC<CompanyListPageProps> = ({ onBack, onNavigateCompanyDetail }) => {
  // Extract unique companies
  const companies = Array.from(new Set(JOB_LISTINGS.map(j => j.company.id)))
    .map(id => JOB_LISTINGS.find(j => j.company.id === id)?.company)
    .filter((c): c is NonNullable<typeof c> => !!c);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
         <div className="max-w-7xl mx-auto">
            <button onClick={onBack} className="text-sm font-bold text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors">
                <ArrowLeft size={16}/> HOMEに戻る
            </button>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">COMPANIES</h1>
            <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">掲載企業一覧</p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 gap-12">
              {companies.map(company => (
                  <div 
                    key={company.id} 
                    className="flex flex-col md:flex-row gap-8 border-b border-gray-100 pb-12 last:border-0 hover:bg-gray-50/50 p-6 rounded-sm transition-colors group cursor-pointer"
                    onClick={() => onNavigateCompanyDetail(company.id)}
                  >
                      {/* Left: Image */}
                      <div className="w-full md:w-1/3 aspect-video md:aspect-auto relative overflow-hidden rounded-sm bg-gray-200 shadow-inner">
                            {company.coverImage ? (
                                <img src={company.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={company.name}/>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">No Image</div>
                            )}
                      </div>

                      {/* Right: Info */}
                      <div className="flex-1 flex flex-col justify-between">
                          <div>
                              <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-sm uppercase tracking-wider">{company.industry || 'IT / Web'}</span>
                              </div>
                              <h2 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{company.name}</h2>
                              <p className="text-gray-800 font-bold text-lg mb-4">{company.mission || "Mission Statement"}</p>
                              <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 md:line-clamp-none">
                                  {company.description}
                              </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-gray-500 border-t border-gray-100 pt-6">
                              <div className="flex items-center gap-2">
                                  <MapPin size={16}/> {company.location}
                              </div>
                              {company.employees && (
                                <div className="flex items-center gap-2">
                                    <Users size={16}/> {company.employees}
                                </div>
                              )}
                              <div className="flex items-center gap-2 ml-auto text-black group-hover:translate-x-1 transition-transform">
                                  詳細を見る <ArrowRight size={16}/>
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};
