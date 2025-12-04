
import React from 'react';
import { JOB_LISTINGS } from '../constants';
import { ArrowRight, MapPin } from 'lucide-react';

interface CompanySectionProps {
  onNavigateCompanyList: () => void;
  onNavigateCompanyDetail: (id: string) => void;
}

export const CompanySection: React.FC<CompanySectionProps> = ({ onNavigateCompanyList, onNavigateCompanyDetail }) => {
  // Extract unique companies
  const companies = Array.from(new Set(JOB_LISTINGS.map(j => j.company.id)))
    .map(id => JOB_LISTINGS.find(j => j.company.id === id)?.company)
    .filter((c): c is NonNullable<typeof c> => !!c)
    .slice(0, 4); // Show only first 4

  return (
    <section className="py-20 border-t border-gray-200">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Featured Companies</h2>
          <p className="text-xs font-bold text-gray-500 mt-2 tracking-widest">
            注目の掲載企業
          </p>
        </div>
        <button 
          onClick={onNavigateCompanyList} 
          className="hidden md:flex items-center gap-1 text-sm font-bold border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
        >
          VIEW ALL <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {companies.map((company) => (
          <div 
            key={company.id} 
            className="group cursor-pointer bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
            onClick={() => onNavigateCompanyDetail(company.id)}
          >
            <div className="h-32 bg-gray-100 relative overflow-hidden">
                {company.coverImage ? (
                    <img src={company.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" alt={company.name}/>
                ) : (
                    <div className="w-full h-full bg-gray-200"></div>
                )}
                <div className="absolute -bottom-6 left-4">
                     <img src={company.logoUrl} className="w-12 h-12 rounded-sm border-2 border-white shadow-sm bg-white" alt=""/>
                </div>
            </div>
            
            <div className="pt-8 p-5 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">{company.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-400 font-bold mb-3">
                        <MapPin size={12}/> {company.location}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                        {company.mission || company.description}
                    </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{company.industry}</span>
                    <span className="text-[10px] font-bold text-black border-b border-black">詳細を見る</span>
                </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Mobile Button */}
      <div className="mt-8 text-center md:hidden">
         <button 
          onClick={onNavigateCompanyList} 
          className="inline-flex items-center gap-2 text-sm font-bold border border-gray-300 px-6 py-3 rounded-sm hover:bg-black hover:text-white transition-colors"
        >
          すべての企業を見る <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
};
