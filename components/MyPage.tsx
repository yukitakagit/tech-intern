
import React, { useState } from 'react';
import { MessageSquare, Briefcase, User, Star, Search, Clock, ListChecks, Lock, Send, ChevronLeft, Mail } from 'lucide-react';
import { JOB_LISTINGS } from '../constants';
import { JobListing, UserProfile } from '../types';

interface MyPageProps {
  userName: string;
  favorites: Set<string>;
  browsingHistory: string[];
  onNavigateJobDetail?: (id: string) => void;
  onNavigateHome: () => void;
  initialTab?: 'chat' | 'history' | 'status' | 'profile' | 'password';
}

// Mock User Profile Data
const initialProfile: UserProfile = {
  name: '田中 太郎',
  gender: 'male',
  phone: '090-1234-5678',
  university: '東京工科大学',
  faculty: '工学部',
  department: '情報工学科',
  graduationYear: '2026',
  email: 'tanaka@example.com',
  address: '東京都八王子市...',
  githubUrl: 'https://github.com/tanakataro',
  skills: 'React, TypeScript, Go',
};

// Mock Chat Data
const CHAT_CONTACTS = [
    { id: '1', name: '株式会社NextGen Creative', lastMessage: '面談の日程についてですが...', time: '10分前', logo: JOB_LISTINGS[0].company.logoUrl },
    { id: '2', name: 'CyberScale Inc.', lastMessage: 'ご応募ありがとうございます。', time: '昨日', logo: JOB_LISTINGS[1].company.logoUrl },
    { id: '3', name: 'DesignShift', lastMessage: 'ポートフォリオを拝見しました。', time: '2日前', logo: JOB_LISTINGS[2].company.logoUrl },
];

const MOCK_MESSAGES = [
    { id: 1, sender: 'company', text: 'ご応募ありがとうございます。書類選考を通過されましたので、ぜひ一度カジュアル面談をお願いできればと思います。', time: '10:00' },
    { id: 2, sender: 'me', text: 'ありがとうございます！ぜひよろしくお願いいたします。来週の水曜日以降であればいつでも調整可能です。', time: '10:05' },
    { id: 3, sender: 'company', text: '承知いたしました。では来週水曜日の14時からはいかがでしょうか？', time: '10:10' },
];

export const MyPage: React.FC<MyPageProps> = ({ userName, favorites, browsingHistory, onNavigateJobDetail, onNavigateHome, initialTab = 'chat' }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'history' | 'status' | 'profile' | 'password'>(initialTab);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [chatInput, setChatInput] = useState('');

  const favoritedJobs = JOB_LISTINGS.filter(job => favorites.has(job.id));
  const historyJobs = JOB_LISTINGS.filter(job => browsingHistory.includes(job.id));

  // Chat View Render Logic
  const renderChat = () => {
    if (selectedChatId) {
        const contact = CHAT_CONTACTS.find(c => c.id === selectedChatId);
        return (
            <div className="flex flex-col h-[600px] animate-fade-in">
                {/* Chat Header */}
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
                    <button onClick={() => setSelectedChatId(null)} className="text-gray-500 hover:text-black transition-colors flex items-center gap-1 font-bold text-sm">
                        <ChevronLeft size={20}/>
                        戻る
                    </button>
                    <div className="h-6 w-px bg-gray-200 mx-2"></div>
                    <img src={contact?.logo} className="w-10 h-10 rounded-full border border-gray-200" alt=""/>
                    <h3 className="font-bold text-gray-900">{contact?.name}</h3>
                </div>
                
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {MOCK_MESSAGES.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-3 rounded-lg text-sm font-medium ${
                                msg.sender === 'me' 
                                ? 'bg-blue-600 text-white rounded-br-none' 
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="メッセージを入力..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                        <Send size={18} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <h3 className="font-black text-xl mb-6 flex items-center gap-2">
                <MessageSquare size={24}/> メッセージ
            </h3>
            <div className="space-y-2">
                {CHAT_CONTACTS.map(contact => (
                    <div 
                        key={contact.id} 
                        onClick={() => setSelectedChatId(contact.id)}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors rounded-sm"
                    >
                        <img src={contact.logo} className="w-12 h-12 rounded-full border border-gray-200" alt=""/>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="font-bold text-sm text-gray-900 truncate">{contact.name}</h4>
                                <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">{contact.time}</span>
                            </div>
                            <p className="text-xs text-gray-500 truncate font-medium">{contact.lastMessage}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  const renderPasswordReset = () => {
    return (
        <div className="animate-fade-in max-w-2xl">
            <h3 className="font-black text-xl mb-8 flex items-center gap-2"><Lock size={24}/> メールアドレス・パスワード再設定</h3>
            
            {/* Email Reset Section */}
            <div className="mb-12 border-b border-gray-100 pb-10">
                <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
                    <Mail size={18}/> メールアドレス変更
                </h4>
                <form className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">現在のメールアドレス <span className="text-red-500">*</span></label>
                        <input type="email" required className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:border-black focus:ring-0 outline-none" placeholder="current@example.com" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">新しいメールアドレス <span className="text-red-500">*</span></label>
                        <input type="email" required className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:border-black focus:ring-0 outline-none" placeholder="new@example.com" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">新しいメールアドレス (確認) <span className="text-red-500">*</span></label>
                        <input type="email" required className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:border-black focus:ring-0 outline-none" placeholder="new@example.com" />
                    </div>
                    <button className="bg-black text-white text-sm font-bold px-8 py-3 rounded-sm hover:bg-gray-800 transition-colors">
                        メールアドレスを変更する
                    </button>
                </form>
            </div>

            {/* Password Reset Section */}
            <div>
                <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
                    <Lock size={18}/> パスワード変更
                </h4>
                <form className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">新しいパスワード <span className="text-red-500">*</span></label>
                        <input type="password" required className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:border-black focus:ring-0 outline-none" placeholder="••••••••" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">新しいパスワード (確認) <span className="text-red-500">*</span></label>
                        <input type="password" required className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:border-black focus:ring-0 outline-none" placeholder="••••••••" />
                    </div>

                    <button className="bg-black text-white text-sm font-bold px-8 py-3 rounded-sm hover:bg-gray-800 transition-colors">
                        パスワードを変更する
                    </button>
                </form>
            </div>
        </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 mb-6">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden">
                     {/* Placeholder Avatar */}
                    <User size={24}/>
                </div>
                <div>
                    <h2 className="font-bold text-sm text-gray-900">{profile.name}</h2>
                    <p className="text-xs text-gray-500">{profile.university}</p>
                </div>
             </div>
          </div>

          <nav className="space-y-1">
             <button 
                onClick={onNavigateHome}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors bg-white text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200 mb-6"
             >
                <Search size={16}/> インターンシップを探す
             </button>

             <button 
                onClick={() => { setActiveTab('chat'); setSelectedChatId(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors ${activeTab === 'chat' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
             >
                <MessageSquare size={16}/> チャット
             </button>
             <button 
                onClick={() => setActiveTab('status')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors ${activeTab === 'status' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
             >
                <ListChecks size={16}/> 採用状況確認
             </button>
             <button 
                onClick={() => setActiveTab('history')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors ${activeTab === 'history' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
             >
                <Clock size={16}/> 閲覧履歴
             </button>
             <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors ${activeTab === 'profile' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
             >
                <User size={16}/> プロフィール設定
             </button>

             <div className="pt-6 mt-6 border-t border-gray-200">
                <button 
                    onClick={() => setActiveTab('password')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors ${activeTab === 'password' ? 'bg-black text-white' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}
                >
                    <Lock size={16}/> パスワード再設定
                </button>
             </div>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white p-8 rounded-md shadow-sm border border-gray-200 min-h-[600px]">
            
            {activeTab === 'chat' && renderChat()}
            {activeTab === 'password' && renderPasswordReset()}

            {activeTab === 'status' && (
                <div className="animate-fade-in">
                    <h3 className="font-black text-xl mb-6 flex items-center gap-2"><ListChecks size={24}/> 採用状況確認</h3>
                    <div className="space-y-4">
                        {/* Mock Status */}
                        {favoritedJobs.length > 0 ? (
                            favoritedJobs.map(job => (
                                <div key={job.id} className="border border-gray-200 p-6 rounded-md flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <img src={job.coverImageUrl} className="w-20 h-16 object-cover rounded-sm" alt=""/>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{job.title}</h4>
                                            <p className="text-sm text-gray-500">{job.company.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-2">書類選考中</span>
                                        <p className="text-xs text-gray-400">応募日: 2024.05.01</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 text-gray-400 font-bold">
                                まだ応募した企業はありません
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="animate-fade-in">
                     <h3 className="font-black text-xl mb-6 flex items-center gap-2"><Clock size={24}/> 閲覧履歴</h3>
                     <div className="grid grid-cols-1 gap-4">
                        {historyJobs.length > 0 ? (
                            historyJobs.map(job => (
                                <div key={job.id} onClick={() => onNavigateJobDetail && onNavigateJobDetail(job.id)} className="border border-gray-200 p-4 rounded-md flex gap-4 cursor-pointer hover:shadow-md transition-shadow">
                                    <img src={job.coverImageUrl} className="w-32 h-20 object-cover rounded-sm" alt=""/>
                                    <div>
                                        <h4 className="font-bold text-sm mb-1 line-clamp-2">{job.title}</h4>
                                        <p className="text-xs text-gray-500">{job.company.name}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm p-4">閲覧履歴はありません。</p>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'profile' && (
                <div className="animate-fade-in">
                    <h3 className="font-black text-xl mb-8 flex items-center gap-2"><User size={24}/> プロフィール設定</h3>
                    <form className="space-y-6 max-w-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">氏名 <span className="text-red-500">*</span></label>
                                <input required type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full p-2 border border-gray-300 rounded-sm text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">性別 <span className="text-red-500">*</span></label>
                                <select required value={profile.gender} onChange={e => setProfile({...profile, gender: e.target.value as any})} className="w-full p-2 border border-gray-300 rounded-sm text-sm">
                                    <option value="male">男性</option>
                                    <option value="female">女性</option>
                                    <option value="other">その他</option>
                                </select>
                            </div>
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">大学名 <span className="text-red-500">*</span></label>
                                <input required type="text" value={profile.university} onChange={e => setProfile({...profile, university: e.target.value})} className="w-full p-2 border border-gray-300 rounded-sm text-sm" />
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">学部 <span className="text-red-500">*</span></label>
                                <input required type="text" value={profile.faculty} onChange={e => setProfile({...profile, faculty: e.target.value})} className="w-full p-2 border border-gray-300 rounded-sm text-sm" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">学科 <span className="text-red-500">*</span></label>
                                <input required type="text" value={profile.department} onChange={e => setProfile({...profile, department: e.target.value})} className="w-full p-2 border border-gray-300 rounded-sm text-sm" />
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">卒業予定年度 <span className="text-red-500">*</span></label>
                                <input required type="text" value={profile.graduationYear} onChange={e => setProfile({...profile, graduationYear: e.target.value})} className="w-full p-2 border border-gray-300 rounded-sm text-sm" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">メールアドレス <span className="text-red-500">*</span></label>
                            <input required type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full p-2 border border-gray-300 rounded-sm text-sm" />
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">電話番号</label>
                            <input type="tel" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full p-2 border border-gray-300 rounded-sm text-sm" placeholder="任意" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">住所</label>
                            <input type="text" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} className="w-full p-2 border border-gray-300 rounded-sm text-sm" placeholder="任意" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">GitHub URL</label>
                            <input type="text" value={profile.githubUrl} onChange={e => setProfile({...profile, githubUrl: e.target.value})} className="w-full p-2 border border-gray-300 rounded-sm text-sm" placeholder="任意" />
                        </div>

                         <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">スキル・アピールポイント</label>
                            <textarea rows={4} value={profile.skills} onChange={e => setProfile({...profile, skills: e.target.value})} className="w-full p-2 border border-gray-300 rounded-sm text-sm" placeholder="任意" />
                        </div>

                        <button className="bg-black text-white text-sm font-bold px-8 py-3 rounded-sm hover:bg-gray-800 transition-colors">
                            プロフィールを更新する
                        </button>
                    </form>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
