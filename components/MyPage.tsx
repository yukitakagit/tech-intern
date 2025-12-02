
import React, { useState } from 'react';
import { MessageSquare, Briefcase, Settings, User, Star } from 'lucide-react';
import { JOB_LISTINGS } from '../constants';

interface MyPageProps {
  userName: string;
  favorites: Set<string>;
  onNavigateJobDetail?: (id: string) => void;
}

export const MyPage: React.FC<MyPageProps> = ({ userName, favorites, onNavigateJobDetail }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'applied' | 'settings'>('chat');
  
  const favoritedJobs = JOB_LISTINGS.filter(job => favorites.has(job.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 mb-6">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                    <User size={24}/>
                </div>
                <div>
                    <h2 className="font-bold text-sm text-gray-900">{userName}</h2>
                    <p className="text-xs text-gray-500">エンジニア志望</p>
                </div>
             </div>
          </div>

          <nav className="space-y-1">
             <button 
                onClick={() => setActiveTab('chat')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors ${activeTab === 'chat' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
             >
                <MessageSquare size={16}/> チャット
             </button>
             <button 
                onClick={() => setActiveTab('applied')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors ${activeTab === 'applied' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
             >
                <Briefcase size={16}/> 応募済み・気になる
             </button>
             <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors ${activeTab === 'settings' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
             >
                <Settings size={16}/> 設定
             </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white p-8 rounded-sm shadow-sm border border-gray-200 min-h-[500px]">
            {activeTab === 'chat' && (
                <div>
                    <h3 className="font-black text-xl mb-6 flex items-center gap-2"><MessageSquare/> メッセージ</h3>
                    <div className="space-y-4">
                        {/* Mock Chat Items */}
                        <div className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors">
                            <img src={JOB_LISTINGS[0].company.logoUrl} className="w-10 h-10 rounded-full" alt=""/>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-sm">{JOB_LISTINGS[0].company.name}</h4>
                                    <span className="text-[10px] text-gray-400">10分前</span>
                                </div>
                                <p className="text-xs text-gray-600 truncate">面談の日程についてですが、来週の水曜日は...</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors">
                            <img src={JOB_LISTINGS[1].company.logoUrl} className="w-10 h-10 rounded-full" alt=""/>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-sm">{JOB_LISTINGS[1].company.name}</h4>
                                    <span className="text-[10px] text-gray-400">昨日</span>
                                </div>
                                <p className="text-xs text-gray-600 truncate">ご応募ありがとうございます。プロフィールを確認...</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'applied' && (
                <div className="space-y-10">
                     {/* Applied (Mock) */}
                     <div>
                        <h3 className="font-black text-lg mb-4 flex items-center gap-2"><Briefcase size={18}/> 応募済み企業</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {JOB_LISTINGS.slice(0, 2).map(job => (
                                <div key={job.id} onClick={() => onNavigateJobDetail && onNavigateJobDetail(job.id)} className="border border-gray-200 p-4 rounded-sm flex gap-4 cursor-pointer hover:shadow-sm">
                                    <img src={job.coverImageUrl} className="w-24 h-16 object-cover rounded-sm" alt=""/>
                                    <div>
                                        <h4 className="font-bold text-sm mb-1">{job.title}</h4>
                                        <p className="text-xs text-gray-500">{job.company.name}</p>
                                        <span className="inline-block mt-2 text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-sm font-bold">応募済み</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>

                     {/* Favorites */}
                     <div>
                        <h3 className="font-black text-lg mb-4 flex items-center gap-2"><Star size={18} className="text-yellow-500"/> お気に入り</h3>
                        {favoritedJobs.length === 0 ? (
                            <p className="text-sm text-gray-500">お気に入りに登録された企業はありません。</p>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {favoritedJobs.map(job => (
                                    <div key={job.id} onClick={() => onNavigateJobDetail && onNavigateJobDetail(job.id)} className="border border-gray-200 p-4 rounded-sm flex gap-4 cursor-pointer hover:shadow-sm">
                                        <img src={job.coverImageUrl} className="w-24 h-16 object-cover rounded-sm" alt=""/>
                                        <div>
                                            <h4 className="font-bold text-sm mb-1">{job.title}</h4>
                                            <p className="text-xs text-gray-500">{job.company.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                     </div>
                </div>
            )}

            {activeTab === 'settings' && (
                <div>
                    <h3 className="font-black text-xl mb-6 flex items-center gap-2"><Settings/> ユーザー設定</h3>
                    <form className="space-y-6 max-w-lg">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">表示名</label>
                            <input type="text" defaultValue={userName} className="w-full p-2 border border-gray-300 rounded-sm text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">GitHub URL</label>
                            <input type="text" placeholder="https://github.com/username" className="w-full p-2 border border-gray-300 rounded-sm text-sm" />
                        </div>
                        <button className="bg-black text-white text-sm font-bold px-6 py-2 rounded-sm">保存する</button>
                    </form>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
