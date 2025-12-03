import React, { useState } from 'react';
import { Company } from '../../types';
import { Save, LogOut, Building2, Globe, MapPin, Users, FileText } from 'lucide-react';

interface CompanyDashboardProps {
  companyName: string;
  onLogout: () => void;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ companyName, onLogout }) => {
  const [profile, setProfile] = useState<Partial<Company>>({
    name: companyName,
    industry: 'システム開発',
    location: '東京都渋谷区...',
    url: 'https://kaxin.jp',
    description: '私たちは...',
    representative: '',
    employees: '10-50名',
    established: '2024年'
  });

  const handleChange = (field: keyof Company, value: string) => {
      setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
      alert('企業情報を保存しました。');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
               <div className="flex items-center gap-2">
                   <Building2 className="text-blue-500"/>
                   <span className="font-bold text-lg">{companyName} <span className="text-gray-500 text-xs ml-2 font-normal">管理画面</span></span>
               </div>
               <button onClick={onLogout} className="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-2">
                   <LogOut size={16}/> ログアウト
               </button>
          </div>
      </header>

      <main className="max-w-4xl mx-auto py-10 px-6">
           <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-black">企業情報編集</h2>
                    <button 
                        onClick={handleSave}
                        className="bg-black text-white text-sm font-bold px-5 py-2 rounded-sm flex items-center gap-2 hover:bg-gray-800 transition-colors"
                    >
                        <Save size={16}/> 保存する
                    </button>
                </div>
                
                <div className="p-8 space-y-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">会社名</label>
                             <input 
                                type="text" 
                                value={profile.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none"
                             />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">業界</label>
                             <input 
                                type="text" 
                                value={profile.industry}
                                onChange={(e) => handleChange('industry', e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none"
                             />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                <Users size={14}/> 従業員数
                             </label>
                             <input 
                                type="text" 
                                value={profile.employees}
                                onChange={(e) => handleChange('employees', e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none"
                             />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">設立年月</label>
                             <input 
                                type="text" 
                                value={profile.established}
                                onChange={(e) => handleChange('established', e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none"
                             />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                           <Globe size={14}/> 公式サイト URL
                        </label>
                        <input 
                           type="text" 
                           value={profile.url}
                           onChange={(e) => handleChange('url', e.target.value)}
                           className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none"
                           placeholder="https://..."
                        />
                   </div>

                   <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                           <MapPin size={14}/> 所在地
                        </label>
                        <input 
                           type="text" 
                           value={profile.location}
                           onChange={(e) => handleChange('location', e.target.value)}
                           className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none"
                        />
                   </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                           <FileText size={14}/> 企業説明
                        </label>
                        <textarea 
                           rows={6}
                           value={profile.description}
                           onChange={(e) => handleChange('description', e.target.value)}
                           className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none leading-relaxed"
                           placeholder="企業のミッションや事業内容について..."
                        />
                   </div>
                </div>
           </div>
      </main>
    </div>
  );
};
