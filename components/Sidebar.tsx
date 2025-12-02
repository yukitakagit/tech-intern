import React from 'react';
import { Search } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 space-y-10 pr-4">
      {/* Search Box */}
      <div className="relative group">
        <input 
          type="text" 
          placeholder="キーワード検索..." 
          className="w-full pl-9 pr-4 py-2 bg-transparent border-b-2 border-gray-300 text-sm font-medium focus:outline-none focus:border-black transition-colors placeholder-gray-400"
        />
        <Search className="absolute left-0 top-2.5 text-gray-400 group-focus-within:text-black transition-colors" size={16} />
      </div>

      {/* Filter Groups - No frame, just text */}
      <div className="space-y-10">
        
        {/* Occupation - Detailed */}
        <div>
            <h4 className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-wider mb-4 border-l-4 border-black pl-2">
                職種
            </h4>
            <div className="space-y-3">
                {[
                    'フロントエンド', 
                    'バックエンド', 
                    'インフラ / SRE', 
                    'ネットワーク', 
                    'モバイルアプリ (iOS/Android)', 
                    'AI / データサイエンス',
                    'ゲーム / XR',
                    '組み込み / IoT'
                ].map(item => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-4 h-4 flex-shrink-0">
                            <input type="checkbox" className="peer appearance-none w-4 h-4 border border-gray-400 rounded-sm checked:bg-black checked:border-black transition-all cursor-pointer" />
                            <div className="absolute hidden peer-checked:block text-white pointer-events-none">
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        <span className="text-xs text-gray-600 font-bold group-hover:text-black transition-colors">{item}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* Programming Languages */}
        <div>
            <h4 className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-wider mb-4 border-l-4 border-black pl-2">
                使用言語
            </h4>
            <div className="space-y-3">
                {[
                    'Python', 'Go', 'TypeScript / JavaScript', 'Java', 'Rust', 'C++', 'Swift', 'Kotlin', 'PHP', 'Ruby'
                ].map(item => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-4 h-4 flex-shrink-0">
                            <input type="checkbox" className="peer appearance-none w-4 h-4 border border-gray-400 rounded-sm checked:bg-black checked:border-black transition-all cursor-pointer" />
                            <div className="absolute hidden peer-checked:block text-white pointer-events-none">
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        <span className="text-xs text-gray-600 font-bold group-hover:text-black transition-colors">{item}</span>
                    </label>
                ))}
            </div>
        </div>

         {/* Industry */}
         <div>
            <h4 className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-wider mb-4 border-l-4 border-black pl-2">
                業種
            </h4>
            <div className="space-y-3">
                {[
                    'Webサービス / SaaS', 
                    'AI / ディープラーニング', 
                    'FinTech', 
                    'ゲーム / エンタメ', 
                    'Eコマース',
                    '受託開発 / SIer',
                    'コンサルティング'
                ].map(item => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-4 h-4 flex-shrink-0">
                            <input type="checkbox" className="peer appearance-none w-4 h-4 border border-gray-400 rounded-sm checked:bg-black checked:border-black transition-all cursor-pointer" />
                            <div className="absolute hidden peer-checked:block text-white pointer-events-none">
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        <span className="text-xs text-gray-600 font-bold group-hover:text-black transition-colors">{item}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* Area */}
        <div>
            <h4 className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-wider mb-4 border-l-4 border-black pl-2">
                エリア
            </h4>
            <div className="space-y-3">
                {['フルリモート', '東京都', '大阪府', '京都府', '福岡県'].map(item => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="peer appearance-none w-4 h-4 border border-gray-400 rounded-sm checked:bg-black checked:border-black transition-all cursor-pointer" />
                        <span className="text-xs text-gray-600 font-bold group-hover:text-black transition-colors">{item}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* Conditions */}
        <div>
            <h4 className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-wider mb-4 border-l-4 border-black pl-2">
                特徴
            </h4>
            <div className="space-y-3">
                {['時給1500円以上', '土日勤務OK', '未経験歓迎', '週2日〜OK', '内定直結'].map(item => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="peer appearance-none w-4 h-4 border border-gray-400 rounded-sm checked:bg-black checked:border-black transition-all cursor-pointer" />
                        <span className="text-xs text-gray-600 font-bold group-hover:text-black transition-colors">{item}</span>
                    </label>
                ))}
            </div>
        </div>
      </div>
      
      {/* Promo Banner - Tech style */}
      <div className="relative overflow-hidden bg-black text-white p-5 rounded-sm group cursor-pointer mt-10">
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-gray-800 rounded-full opacity-50 blur-xl"></div>
        <h4 className="font-bold text-sm mb-2 relative z-10">GitHub連携</h4>
        <p className="text-[10px] text-gray-400 mb-3 leading-relaxed relative z-10">
            あなたのコードを解析し、最適な企業とマッチング。
        </p>
        <div className="h-0.5 w-8 bg-white group-hover:w-full transition-all duration-300"></div>
      </div>
    </aside>
  );
};